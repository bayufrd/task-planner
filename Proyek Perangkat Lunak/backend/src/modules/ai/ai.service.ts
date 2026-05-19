import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';

const CACHE_DURATION_HOURS = 1;

export interface ParsedTaskCommand {
  title: string;
  description?: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDuration: number;
  tags: string[];
  reminderTime: number;
}

export interface ResolvedWhatsappAction {
  action: 'REGISTER' | 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'COMPLETE_TASK' | 'LIST_TASKS' | 'LIST_BY_DATE' | 'OVERVIEW' | 'HELP';
  confidence: number;
  targetText?: string;
  dateHint?: string;
  status?: 'PENDING' | 'DONE' | 'SKIPPED';
  updates?: Partial<ParsedTaskCommand>;
  replyStyle?: 'SHORT' | 'NORMAL' | 'FRIENDLY';
}

interface NineRouterChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const DEFAULT_MODEL = 'cx/gpt-5.2';

const getJsonFromText = (text: string): unknown => {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fencedMatch?.[1] ?? trimmed;
  return JSON.parse(jsonText);
};

const normalizePriority = (priority: unknown): 'HIGH' | 'MEDIUM' | 'LOW' => {
  if (typeof priority !== 'string') return 'MEDIUM';
  const upper = priority.toUpperCase();

  if (upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
    return upper;
  }

  return 'MEDIUM';
};

const normalizeTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) return [];

  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
    .slice(0, 10);
};

const normalizeDuration = (duration: unknown): number => {
  if (typeof duration !== 'number' || Number.isNaN(duration)) return 60;

  const rounded = Math.round(duration);
  if (rounded <= 0) return 60;

  return rounded;
};

const normalizeReminderTime = (reminderTime: unknown): number => {
  if (typeof reminderTime !== 'number' || Number.isNaN(reminderTime)) return 60;

  const rounded = Math.round(reminderTime);
  if (rounded < 0) return 60;

  return rounded;
};

const INDONESIA_TIME_ZONE = 'Asia/Jakarta';
const INDONESIA_UTC_OFFSET_HOURS = 7;

const getJakartaDateParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDONESIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value || '0');

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
};

const createJakartaDate = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number = 0
) => new Date(Date.UTC(year, month - 1, day, hour - INDONESIA_UTC_OFFSET_HOURS, minute, second, 0));

/**
 * Deterministic post-processing for common Indonesian date/time phrases.
 * This fixes LLM timezone/day ambiguity in Asia/Jakarta:
 * - "besok" = local today + 1 day
 * - "lusa" = local today + 2 days
 * - "jam 10 malam" = 22:00 WIB
 * - "jam 8 malam" = 20:00 WIB
 * - "jam 3 sore" = 15:00 WIB
 */
const applyIndonesianTimeHints = (input: string, deadline: Date, now: Date): Date => {
  const lower = input.toLowerCase();
  const nowJakarta = getJakartaDateParts(now);
  const deadlineJakarta = getJakartaDateParts(deadline);

  let base = createJakartaDate(
    deadlineJakarta.year,
    deadlineJakarta.month,
    deadlineJakarta.day,
    deadlineJakarta.hour,
    deadlineJakarta.minute,
    deadlineJakarta.second
  );

  if (/\bbesok\b/.test(lower)) {
    base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day + 1, deadlineJakarta.hour, deadlineJakarta.minute, 0);
  } else if (/\blusa\b/.test(lower)) {
    base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day + 2, deadlineJakarta.hour, deadlineJakarta.minute, 0);
  } else if (/\b(hari ini|today)\b/.test(lower)) {
    base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day, deadlineJakarta.hour, deadlineJakarta.minute, 0);
  }

  const jamMatch = lower.match(/\b(?:jam|pukul)\s+(\d{1,2})(?:(?::|\.)(\d{2}))?\s*(pagi|siang|sore|malam)?\b/);
  if (jamMatch) {
    let hour = Number(jamMatch[1]);
    const minute = jamMatch[2] ? Number(jamMatch[2]) : 0;
    const period = jamMatch[3];

    if (period === 'malam') {
      if (hour === 12) hour = 0;
      else if (hour >= 1 && hour <= 11) hour += 12;
    } else if (period === 'sore') {
      if (hour >= 1 && hour <= 11) hour += 12;
    } else if (period === 'siang') {
      if (hour >= 1 && hour <= 10) hour += 12;
    } else if (period === 'pagi') {
      if (hour === 12) hour = 0;
    }

    const baseJakarta = getJakartaDateParts(base);
    base = createJakartaDate(baseJakarta.year, baseJakarta.month, baseJakarta.day, hour, minute, 0);
  }

  return base;
};

export class AiService {
  async parseTaskCommand(input: string): Promise<ParsedTaskCommand> {
    if (!env.NINE_ROUTER_API || !env.NINE_ROUTER_API_KEY) {
      throw new Error('9Router is not configured');
    }

    const now = new Date();

    const response = await fetch(env.NINE_ROUTER_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NINE_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.NINE_ROUTER_MODEL || DEFAULT_MODEL,
        stream: false,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: [
              'You are a deterministic task command parser for Smart Task Planner.',
              'Return ONLY valid JSON. No markdown, no explanation.',
              'Parse Indonesian and English natural language task commands.',
              'Output schema:',
              '{',
              '  "title": string,',
              '  "description": string,',
              '  "deadline": ISO-8601 string,',
              '  "priority": "HIGH" | "MEDIUM" | "LOW",',
              '  "estimatedDuration": number,',
              '  "tags": string[],',
              '  "reminderTime": number',
              '}',
              'Rules:',
              '- title: clean task title without date/time/duration/priority/tag tokens.',
              '- deadline: always output absolute ISO-8601 datetime using the provided current datetime as reference.',
              '- Interpret all Indonesian date/time phrases in timezone Asia/Jakarta (WIB / UTC+7).',
              '- Indonesian "besok" means exactly local current date + 1 day, not +2 days.',
              '- Indonesian "lusa" means exactly local current date + 2 days.',
              '- Indonesian "hari ini" means local current date.',
              '- Indonesian "jam 8 malam" = 20:00, "jam 9 malam" = 21:00, "jam 10 malam" = 22:00, "jam 12 malam" = 00:00.',
              '- Indonesian "jam 8 pagi" = 08:00, "jam 9 pagi" = 09:00, "jam 10 pagi" = 10:00.',
              '- Indonesian "jam 12 siang" = 12:00.',
              '- Indonesian "jam 3 sore" = 15:00, "jam 6 sore" = 18:00, "jam 7 sore" = 19:00.',
              '- If user writes pagi/siang/sore/malam, convert to 24-hour Indonesian local time correctly.',
              '- priority default: MEDIUM.',
              '- estimatedDuration default: 60 minutes if omitted.',
              '- reminderTime default: 60 minutes before deadline if omitted.',
              '- tags: extract hashtags without #; default [].',
              '- If command says important/urgent/penting/mendesak, priority HIGH.',
              '- If command says low/santai/rendah, priority LOW.',
              '- If deadline is omitted, use tomorrow at 09:00 local time.',
              '- If date exists but time omitted, use 09:00 local time.',
              '- Never invent unrelated details.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({
              currentDateTime: now.toISOString(),
              localDateString: now.toLocaleDateString('en-CA', { timeZone: INDONESIA_TIME_ZONE }),
              localTimeString: now.toLocaleTimeString('en-GB', { timeZone: INDONESIA_TIME_ZONE, hour12: false }),
              timezone: INDONESIA_TIME_ZONE,
              timezoneOffsetHours: INDONESIA_UTC_OFFSET_HOURS,
              command: input,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`9Router request failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as NineRouterChatResponse;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('9Router response did not include message content');
    }

    const parsed = getJsonFromText(content) as Partial<ParsedTaskCommand>;

    if (!parsed.title || typeof parsed.title !== 'string') {
      throw new Error('Parsed task title is missing');
    }

    const deadline = parsed.deadline ? new Date(parsed.deadline) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (Number.isNaN(deadline.getTime())) {
      throw new Error('Parsed task deadline is invalid');
    }

    const normalizedDeadline = applyIndonesianTimeHints(input, deadline, now);

    return {
      title: parsed.title.trim(),
      description: typeof parsed.description === 'string' ? parsed.description.trim() : '',
      deadline: normalizedDeadline.toISOString(),
      priority: normalizePriority(parsed.priority),
      estimatedDuration: normalizeDuration(parsed.estimatedDuration),
      tags: normalizeTags(parsed.tags),
      reminderTime: normalizeReminderTime(parsed.reminderTime),
    };
  }

  async resolveWhatsappAction(input: string): Promise<ResolvedWhatsappAction> {
    if (!env.NINE_ROUTER_API || !env.NINE_ROUTER_API_KEY) {
      throw new Error('9Router is not configured');
    }

    const response = await fetch(env.NINE_ROUTER_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NINE_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.NINE_ROUTER_MODEL || DEFAULT_MODEL,
        stream: false,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: [
              'You are a deterministic WhatsApp action resolver for Smart Task Planner.',
              'Return ONLY valid JSON. No markdown, no explanation.',
              'The incoming command is already normalized by the WhatsApp bot and usually DOES NOT contain the prefix "task".',
              'Infer the user intent and extract only the fields needed for backend execution.',
              'Allowed actions:',
              '- REGISTER',
              '- CREATE_TASK',
              '- UPDATE_TASK',
              '- DELETE_TASK',
              '- COMPLETE_TASK',
              '- LIST_TASKS',
              '- LIST_BY_DATE',
              '- OVERVIEW',
              '- HELP',
              'Output schema:',
              '{',
              '  "action": "REGISTER" | "CREATE_TASK" | "UPDATE_TASK" | "DELETE_TASK" | "COMPLETE_TASK" | "LIST_TASKS" | "LIST_BY_DATE" | "OVERVIEW" | "HELP",',
              '  "confidence": number,',
              '  "targetText": string,',
              '  "dateHint": string,',
              '  "status": "PENDING" | "DONE" | "SKIPPED",',
              '  "updates": {',
              '    "title": string,',
              '    "description": string,',
              '    "deadline": ISO-8601 string,',
              '    "priority": "HIGH" | "MEDIUM" | "LOW",',
              '    "estimatedDuration": number,',
              '    "tags": string[],',
              '    "reminderTime": number',
              '  },',
              '  "replyStyle": "SHORT" | "NORMAL" | "FRIENDLY"',
              '}',
              'Rules:',
              '- REGISTER only for pattern like "<userId> daftar".',
              '- CREATE_TASK for new task requests.',
              '- COMPLETE_TASK when user means finish/selesai/tandai selesai a task.',
              '- DELETE_TASK when user means hapus/delete/remove a task.',
              '- UPDATE_TASK when user means edit/ubah/update/reschedule a task.',
              '- LIST_BY_DATE when user asks schedule/tasks for hari ini/besok/lusa/tanggal tertentu.',
              '- LIST_TASKS for general list/schedule queries without a clear date filter.',
              '- OVERVIEW for summary/ringkasan/overview.',
              '- HELP for bantuan/help/menu/unclear instructions.',
              '- targetText should contain the task phrase being referred to for update/delete/complete.',
              '- dateHint should preserve natural date hints like "hari ini", "besok", "20 mei 2026", "jam 9" when relevant.',
              '- status should be DONE for COMPLETE_TASK, SKIPPED only if user explicitly means skip.',
              '- For CREATE_TASK and UPDATE_TASK, fill updates with structured task info when possible.',
              '- If unsure, choose the most likely action, set confidence below 0.7, and keep extraction conservative.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({ command: input }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`9Router request failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as NineRouterChatResponse;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('9Router response did not include message content');
    }

    const parsed = getJsonFromText(content) as Partial<ResolvedWhatsappAction>;
    const allowedActions: ResolvedWhatsappAction['action'][] = [
      'REGISTER',
      'CREATE_TASK',
      'UPDATE_TASK',
      'DELETE_TASK',
      'COMPLETE_TASK',
      'LIST_TASKS',
      'LIST_BY_DATE',
      'OVERVIEW',
      'HELP',
    ];

    const action = allowedActions.includes(parsed.action as ResolvedWhatsappAction['action'])
      ? (parsed.action as ResolvedWhatsappAction['action'])
      : 'HELP';

    const confidence = typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0.5;

    const updates = parsed.updates
      ? {
          title: typeof parsed.updates.title === 'string' ? parsed.updates.title.trim() : undefined,
          description: typeof parsed.updates.description === 'string' ? parsed.updates.description.trim() : undefined,
          deadline: typeof parsed.updates.deadline === 'string' ? parsed.updates.deadline : undefined,
          priority: normalizePriority(parsed.updates.priority),
          estimatedDuration: normalizeDuration(parsed.updates.estimatedDuration),
          tags: normalizeTags(parsed.updates.tags),
          reminderTime: normalizeReminderTime(parsed.updates.reminderTime),
        }
      : undefined;

    return {
      action,
      confidence,
      targetText: typeof parsed.targetText === 'string' ? parsed.targetText.trim() : undefined,
      dateHint: typeof parsed.dateHint === 'string' ? parsed.dateHint.trim() : undefined,
      status: parsed.status === 'DONE' || parsed.status === 'PENDING' || parsed.status === 'SKIPPED' ? parsed.status : undefined,
      updates,
      replyStyle: parsed.replyStyle === 'SHORT' || parsed.replyStyle === 'FRIENDLY' || parsed.replyStyle === 'NORMAL' ? parsed.replyStyle : 'NORMAL',
    };
  }

  async analyzeOverview(userId: string, stats: any, dailyData: any[]): Promise<{
    score: number;
    insights: string[];
    advice: Array<{ title: string; description: string; type: string }>;
  }> {
    const total = stats.pending + stats.done + stats.skipped;
    
    // Check cache first
    const cached = await prisma.overviewAnalysisCache.findUnique({
      where: { userId },
    });

    const now = new Date();
    let isCacheValid = false;
    let isDataConsistent = false;

    if (cached) {
      // Handle potential null/undefined expiresAt
      const expiresAt = cached.expiresAt || new Date(0);
      isCacheValid = expiresAt > now;
      
      isDataConsistent =
        cached.totalTasks === total &&
        cached.completedTasks === stats.done &&
        cached.pendingTasks === stats.pending &&
        cached.skippedTasks === stats.skipped;
    }

    // Return cached data if valid and consistent
    if (isCacheValid && isDataConsistent && cached) {
      try {
        return {
          score: cached.score,
          insights: cached.insights ? JSON.parse(cached.insights) : [],
          advice: cached.advice ? JSON.parse(cached.advice) : [],
        };
      } catch (error) {
        console.error('Failed to parse cached analysis data:', error);
        // If JSON parsing fails, invalidate cache and continue to generate new analysis
        await this.invalidateCache(userId);
      }
    }

    // If no cache or invalid, generate new analysis
    if (!env.NINE_ROUTER_API || !env.NINE_ROUTER_API_KEY) {
      throw new Error('9Router is not configured');
    }

    const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;
    const skipRate = total > 0 ? Math.round((stats.skipped / total) * 100) : 0;

    // Calculate average daily completion
    const recentDays = dailyData.slice(-7);
    const avgDailyCompletion = recentDays.length > 0
      ? Math.round(recentDays.reduce((sum, day) => sum + day.count, 0) / recentDays.length)
      : 0;

    const response = await fetch(env.NINE_ROUTER_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NINE_ROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.NINE_ROUTER_MODEL || DEFAULT_MODEL,
        stream: false,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: [
              'Anda adalah AI analisis produktivitas untuk Smart Task Planner.',
              'Analisis pola penyelesaian tugas pengguna dan berikan wawasan yang dapat ditindaklanjuti.',
              'Kembalikan HANYA JSON yang valid. Tidak ada markdown, tidak ada penjelasan.',
              'Skema output:',
              '{',
              '  "score": number (0-100),',
              '  "insights": string[] (3-5 observasi kunci dalam Bahasa Indonesia),',
              '  "advice": [{ "title": string, "description": string, "type": "success"|"warning"|"info" }] (3 kartu dalam Bahasa Indonesia)',
              '}',
              'Aturan:',
              '- score: 0-100 berdasarkan tingkat penyelesaian, konsistensi, dan keseimbangan beban kerja',
              '- insights: observasi spesifik tentang pola dalam Bahasa Indonesia',
              '- advice: rekomendasi yang dapat ditindaklanjuti dengan tipe yang sesuai dalam Bahasa Indonesia',
              '- Bersikaplah mendorong tetapi jujur',
              '- Fokus pada peningkatan produktivitas',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify({
              totalTasks: total,
              completed: stats.done,
              pending: stats.pending,
              skipped: stats.skipped,
              completionRate: `${completionRate}%`,
              skipRate: `${skipRate}%`,
              avgDailyCompletion,
              recentDailyData: recentDays,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`9Router request failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as NineRouterChatResponse;
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('9Router response did not include message content');
    }

    const parsed = getJsonFromText(content) as any;

    // Validate and normalize response
    const analysis = {
      score: typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 50,
      insights: Array.isArray(parsed.insights) ? parsed.insights.slice(0, 5) : [],
      advice: Array.isArray(parsed.advice)
        ? parsed.advice.slice(0, 3).map((item: any) => ({
            title: String(item.title || 'Tip'),
            description: String(item.description || ''),
            type: ['success', 'warning', 'info'].includes(item.type) ? item.type : 'info',
          }))
        : [],
    };

    // Cache the result
    const expiresAt = new Date(now.getTime() + CACHE_DURATION_HOURS * 60 * 60 * 1000);
    
    await prisma.overviewAnalysisCache.upsert({
      where: { userId },
      create: {
        userId,
        score: analysis.score,
        insights: JSON.stringify(analysis.insights),
        advice: JSON.stringify(analysis.advice),
        totalTasks: total,
        completedTasks: stats.done,
        pendingTasks: stats.pending,
        skippedTasks: stats.skipped,
        expiresAt,
      },
      update: {
        score: analysis.score,
        insights: JSON.stringify(analysis.insights),
        advice: JSON.stringify(analysis.advice),
        totalTasks: total,
        completedTasks: stats.done,
        pendingTasks: stats.pending,
        skippedTasks: stats.skipped,
        expiresAt,
        updatedAt: now,
      },
    });

    return analysis;
  }

  // Invalidate cache when tasks change
  async invalidateCache(userId: string): Promise<void> {
    await prisma.overviewAnalysisCache.delete({
      where: { userId },
    }).catch(() => {
      // Ignore if not found
    });
  }
}