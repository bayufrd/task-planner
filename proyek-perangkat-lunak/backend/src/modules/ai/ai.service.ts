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

export interface ResolveWhatsappPlanInput {
  command: string;
  waNumber?: string;
}

export interface ResolvedWhatsappPlan {
  confidence: number;
  replyStyle: 'SHORT' | 'NORMAL' | 'FRIENDLY';
  actions: ResolvedWhatsappAction[];
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
const INDONESIAN_MONTHS: Record<string, number> = {
  januari: 1,
  jan: 1,
  februari: 2,
  feb: 2,
  maret: 3,
  mar: 3,
  april: 4,
  apr: 4,
  mei: 5,
  juni: 6,
  jun: 6,
  juli: 7,
  jul: 7,
  agustus: 8,
  agu: 8,
  ags: 8,
  september: 9,
  sep: 9,
  oktober: 10,
  okt: 10,
  november: 11,
  nov: 11,
  desember: 12,
  des: 12,
};
const INDONESIAN_WEEKDAYS: Record<string, number> = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  jumatnya: 5,
  jumatan: 5,
  "jum'at": 5,
  friday: 5,
  sabtu: 6,
};

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

const clampToValidMonthDay = (year: number, month: number, day: number) => {
  const candidate = createJakartaDate(year, month, day, 0, 0, 0);
  return getJakartaDateParts(candidate).day === day ? candidate : null;
};

const findFutureWeekdayDate = (base: Date, weekday: number) => {
  const baseParts = getJakartaDateParts(base);
  const baseDate = createJakartaDate(baseParts.year, baseParts.month, baseParts.day, 0, 0, 0);
  const currentWeekday = baseDate.getUTCDay();
  let diff = (weekday - currentWeekday + 7) % 7;
  if (diff === 0) diff = 7;

  const candidate = new Date(baseDate);
  candidate.setUTCDate(candidate.getUTCDate() + diff);
  return candidate;
};

const extractPreferredSchedulePhrase = (input: string): string => {
  const normalized = input.trim();
  if (!normalized) return normalized;

  const connectors = [
    /\b(?:diundur|undur|reschedule|jadwal(?:nya)?\s+diundur)\s+ke\b/gi,
    /\b(?:diganti|ganti|ubah|update|edit)\s+(?:ke\s+)?(?:hari|tanggal|jam|pukul)?/gi,
    /\b(?:jadi|menjadi)\b/gi,
    /\byaitu\b/gi,
  ];

  let bestIndex = -1;

  for (const regex of connectors) {
    for (const match of normalized.matchAll(regex)) {
      if (typeof match.index !== 'number') continue;
      const candidateIndex = match.index + match[0].length;
      if (candidateIndex >= bestIndex) {
        bestIndex = candidateIndex;
      }
    }
  }

  if (bestIndex < 0) return normalized;

  const preferred = normalized.slice(bestIndex).trim();
  return preferred || normalized;
};

const resolveExplicitDateHint = (input: string, deadline: Date, now: Date): Date | null => {
  const lower = input.toLowerCase();
  const preferred = extractPreferredSchedulePhrase(lower);
  const source = preferred || lower;
  const nowJakarta = getJakartaDateParts(now);
  const deadlineJakarta = getJakartaDateParts(deadline);
  const baseDate = createJakartaDate(deadlineJakarta.year, deadlineJakarta.month, deadlineJakarta.day, 0, 0, 0);

  const fullDateMatch = source.match(/\b(?:tanggal\s+)?(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|jan|feb|mar|apr|mei|jun|jul|agu|ags|sep|okt|nov|des)(?:\s+(\d{4}))?\b/i);
  if (fullDateMatch) {
    const day = Number(fullDateMatch[1]);
    const month = INDONESIAN_MONTHS[fullDateMatch[2].toLowerCase()];
    const year = fullDateMatch[3] ? Number(fullDateMatch[3]) : nowJakarta.year;
    const candidate = clampToValidMonthDay(year, month, day);

    if (candidate) {
      if (!fullDateMatch[3] && candidate < baseDate) {
        return clampToValidMonthDay(year + 1, month, day);
      }

      return candidate;
    }
  }

  const tanggalMatch = source.match(/\btanggal\s+(\d{1,2})\b/i);
  if (tanggalMatch) {
    const day = Number(tanggalMatch[1]);
    const month = nowJakarta.month;
    let year = nowJakarta.year;
    let candidate = clampToValidMonthDay(year, month, day);

    if (candidate && candidate < baseDate) {
      const nextMonth = month === 12 ? 1 : month + 1;
      year = month === 12 ? year + 1 : year;
      candidate = clampToValidMonthDay(year, nextMonth, day);
    }

    return candidate;
  }

  const weekdayMatch = source.match(/\b(minggu|senin|selasa|rabu|kamis|jumat|jum'at|friday|sabtu)\b/i);
  if (weekdayMatch) {
    const weekday = INDONESIAN_WEEKDAYS[weekdayMatch[1].toLowerCase()];
    if (typeof weekday === 'number') {
      return findFutureWeekdayDate(baseDate, weekday);
    }
  }

  return null;
};

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
  const preferredSchedulePhrase = extractPreferredSchedulePhrase(lower);
  const nowJakarta = getJakartaDateParts(now);
  const deadlineJakarta = getJakartaDateParts(deadline);
  const explicitDate = resolveExplicitDateHint(preferredSchedulePhrase, deadline, now);

  let base = explicitDate
    ? createJakartaDate(
        getJakartaDateParts(explicitDate).year,
        getJakartaDateParts(explicitDate).month,
        getJakartaDateParts(explicitDate).day,
        deadlineJakarta.hour,
        deadlineJakarta.minute,
        deadlineJakarta.second
      )
    : createJakartaDate(
        deadlineJakarta.year,
        deadlineJakarta.month,
        deadlineJakarta.day,
        deadlineJakarta.hour,
        deadlineJakarta.minute,
        deadlineJakarta.second
      );

  if (!explicitDate) {
    if (/\bbesok\b/.test(preferredSchedulePhrase)) {
      base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day + 1, deadlineJakarta.hour, deadlineJakarta.minute, 0);
    } else if (/\blusa\b/.test(preferredSchedulePhrase)) {
      base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day + 2, deadlineJakarta.hour, deadlineJakarta.minute, 0);
    } else if (/\b(hari ini|today)\b/.test(preferredSchedulePhrase)) {
      base = createJakartaDate(nowJakarta.year, nowJakarta.month, nowJakarta.day, deadlineJakarta.hour, deadlineJakarta.minute, 0);
    }
  }

  const detectPeriodContext = (start: number, end: number): 'pagi' | 'siang' | 'sore' | 'malam' | undefined => {
    const localWindow = lower.slice(Math.max(0, start - 24), Math.min(lower.length, end + 24));
    const globalContext = [
      { period: 'malam' as const, regex: /\b(nanti malam|malam ini|malam)\b/ },
      { period: 'sore' as const, regex: /\b(sore ini|sore)\b/ },
      { period: 'siang' as const, regex: /\b(siang ini|siang)\b/ },
      { period: 'pagi' as const, regex: /\b(pagi ini|pagi)\b/ },
    ];

    for (const item of globalContext) {
      if (item.regex.test(localWindow)) return item.period;
    }

    for (const item of globalContext) {
      if (item.regex.test(lower)) return item.period;
    }

    return undefined;
  };

  const applyPeriodToHour = (hour: number, period?: 'pagi' | 'siang' | 'sore' | 'malam') => {
    if (period === 'malam') {
      if (hour === 12) return 0;
      if (hour >= 1 && hour <= 11) return hour + 12;
      return hour;
    }

    if (period === 'sore') {
      if (hour >= 1 && hour <= 11) return hour + 12;
      return hour;
    }

    if (period === 'siang') {
      if (hour >= 1 && hour <= 10) return hour + 12;
      return hour;
    }

    if (period === 'pagi') {
      if (hour === 12) return 0;
      return hour;
    }

    return hour;
  };

  const setengahRegex = /\b(?:jam|pukul)\s+setengah\s+(\d{1,2})(?:\s+(pagi|siang|sore|malam))?\b/g;
  const setengahMatches = Array.from(lower.matchAll(setengahRegex));
  const setengahMatch = setengahMatches.find((match) => !/\bbukan\s*$/.test(lower.slice(Math.max(0, match.index! - 16), match.index!))) || setengahMatches[0];

  if (setengahMatch && typeof setengahMatch.index === 'number') {
    let hour = Number(setengahMatch[1]) - 1;
    const minute = 30;
    const explicitPeriod = setengahMatch[2] as 'pagi' | 'siang' | 'sore' | 'malam' | undefined;
    const period = explicitPeriod || detectPeriodContext(setengahMatch.index, setengahMatch.index + setengahMatch[0].length);

    if (hour < 0) hour = 0;
    hour = applyPeriodToHour(hour, period);

    const baseJakarta = getJakartaDateParts(base);
    return createJakartaDate(baseJakarta.year, baseJakarta.month, baseJakarta.day, hour, minute, 0);
  }

  const jamRegex = /\b(?:jam|pukul)\s+(\d{1,2})(?:(?::|\.)(\d{2}))?(?:\s+(pagi|siang|sore|malam))?\b/g;
  const jamMatches = Array.from(lower.matchAll(jamRegex));
  const jamMatch = jamMatches.find((match) => !/\bbukan\s*$/.test(lower.slice(Math.max(0, match.index! - 16), match.index!))) || jamMatches[0];

  if (jamMatch && typeof jamMatch.index === 'number') {
    let hour = Number(jamMatch[1]);
    const minute = jamMatch[2] ? Number(jamMatch[2]) : 0;
    const explicitPeriod = jamMatch[3] as 'pagi' | 'siang' | 'sore' | 'malam' | undefined;
    const period = explicitPeriod || detectPeriodContext(jamMatch.index, jamMatch.index + jamMatch[0].length);

    hour = applyPeriodToHour(hour, period);

    const baseJakarta = getJakartaDateParts(base);
    return createJakartaDate(baseJakarta.year, baseJakarta.month, baseJakarta.day, hour, minute, 0);
  }

  return base;
};

const normalizeDeadlineWithCommandHints = (input: string, deadline: string | undefined, now: Date): string | undefined => {
  if (typeof deadline !== 'string') return undefined;

  const parsedDeadline = new Date(deadline);
  if (Number.isNaN(parsedDeadline.getTime())) return undefined;

  return applyIndonesianTimeHints(input, parsedDeadline, now).toISOString();
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

  async resolveWhatsappPlan(input: string | ResolveWhatsappPlanInput): Promise<ResolvedWhatsappPlan> {
    if (!env.NINE_ROUTER_API || !env.NINE_ROUTER_API_KEY) {
      throw new Error('9Router is not configured');
    }

    const payload = typeof input === 'string'
      ? { command: input }
      : { command: input.command, waNumber: input.waNumber };

    const now = new Date();

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

    const normalizeAction = (raw?: Partial<ResolvedWhatsappAction>): ResolvedWhatsappAction => {
      const action = allowedActions.includes(raw?.action as ResolvedWhatsappAction['action'])
        ? (raw?.action as ResolvedWhatsappAction['action'])
        : 'HELP';

      const confidence = typeof raw?.confidence === 'number' && !Number.isNaN(raw.confidence)
        ? Math.max(0, Math.min(1, raw.confidence))
        : 0.5;

      const updates = raw?.updates
        ? {
            title: typeof raw.updates.title === 'string' ? raw.updates.title.trim() : undefined,
            description: typeof raw.updates.description === 'string' ? raw.updates.description.trim() : undefined,
            deadline: normalizeDeadlineWithCommandHints(
              [payload.command, raw?.dateHint, raw?.targetText, typeof raw.updates.title === 'string' ? raw.updates.title : undefined]
                .filter(Boolean)
                .join(' '),
              raw.updates.deadline,
              now
            ),
            priority: normalizePriority(raw.updates.priority),
            estimatedDuration: normalizeDuration(raw.updates.estimatedDuration),
            tags: normalizeTags(raw.updates.tags),
            reminderTime: normalizeReminderTime(raw.updates.reminderTime),
          }
        : undefined;

      return {
        action,
        confidence,
        targetText: typeof raw?.targetText === 'string' ? raw.targetText.trim() : undefined,
        dateHint: typeof raw?.dateHint === 'string' ? raw.dateHint.trim() : undefined,
        status: raw?.status === 'DONE' || raw?.status === 'PENDING' || raw?.status === 'SKIPPED' ? raw.status : undefined,
        updates,
        replyStyle: raw?.replyStyle === 'SHORT' || raw?.replyStyle === 'FRIENDLY' || raw?.replyStyle === 'NORMAL' ? raw.replyStyle : 'NORMAL',
      };
    };

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
              'You are a deterministic WhatsApp multi-action resolver for Smart Task Planner.',
              'Return ONLY valid JSON. No markdown, no explanation.',
              'The incoming command is already normalized by the WhatsApp bot and usually DOES NOT contain the prefix "task".',
              'Infer the user intent and split the request into one or more backend actions when needed.',
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
              '  "confidence": number,',
              '  "replyStyle": "SHORT" | "NORMAL" | "FRIENDLY",',
              '  "actions": [',
              '    {',
              '      "action": "REGISTER" | "CREATE_TASK" | "UPDATE_TASK" | "DELETE_TASK" | "COMPLETE_TASK" | "LIST_TASKS" | "LIST_BY_DATE" | "OVERVIEW" | "HELP",',
              '      "confidence": number,',
              '      "targetText": string,',
              '      "dateHint": string,',
              '      "status": "PENDING" | "DONE" | "SKIPPED",',
              '      "updates": {',
              '        "title": string,',
              '        "description": string,',
              '        "deadline": ISO-8601 string,',
              '        "priority": "HIGH" | "MEDIUM" | "LOW",',
              '        "estimatedDuration": number,',
              '        "tags": string[],',
              '        "reminderTime": number',
              '      },',
              '      "replyStyle": "SHORT" | "NORMAL" | "FRIENDLY"',
              '    }',
              '  ]',
              '}',
              'Rules:',
              '- Output at least one action.',
              '- Split commands into multiple actions when the user clearly asks multiple operations or multiple task targets.',
              '- Prefer one task target per action. Example: "hapus meeting A dan meeting B" => two DELETE_TASK actions.',
              '- If user mixes actions, preserve order. Example: "buat task A lalu hapus task B" => CREATE_TASK then DELETE_TASK.',
              '- REGISTER only for pattern like "<userId> daftar".',
              '- CREATE_TASK for new task requests.',
              '- COMPLETE_TASK when user means finish/selesai/tandai selesai a task.',
              '- DELETE_TASK when user means hapus/delete/remove a task.',
              '- UPDATE_TASK when user means edit/ubah/update/reschedule a task.',
              '- LIST_BY_DATE when user asks schedule/tasks for hari ini/besok/lusa/tanggal tertentu.',
              '- LIST_TASKS for general list/schedule queries without a clear date filter.',
              '- OVERVIEW for summary/ringkasan/overview.',
              '- HELP for bantuan/help/menu/unclear instructions.',
              '- targetText should contain only the task phrase for that one action.',
              '- dateHint should preserve natural date hints like "hari ini", "besok", "20 mei 2026", "jam 9" when relevant.',
              '- status should be DONE for COMPLETE_TASK, SKIPPED only if user explicitly means skip.',
              '- For CREATE_TASK and UPDATE_TASK, fill updates with structured task info when possible.',
              '- Do not merge distinct task targets into one action if they can be separated.',
              '- If the command is ambiguous, keep actions conservative and lower confidence.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: JSON.stringify(payload),
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

    const parsed = getJsonFromText(content) as Partial<ResolvedWhatsappPlan> & {
      actions?: Array<Partial<ResolvedWhatsappAction>>;
      action?: ResolvedWhatsappAction['action'];
      targetText?: string;
      dateHint?: string;
      status?: 'PENDING' | 'DONE' | 'SKIPPED';
      updates?: Partial<ParsedTaskCommand>;
    };

    const rawActions = Array.isArray(parsed.actions) && parsed.actions.length > 0
      ? parsed.actions
      : [{
          action: parsed.action,
          confidence: parsed.confidence,
          targetText: parsed.targetText,
          dateHint: parsed.dateHint,
          status: parsed.status,
          updates: parsed.updates,
          replyStyle: parsed.replyStyle,
        }];

    const actions = rawActions.map((item) => normalizeAction(item)).filter((item) => Boolean(item.action));

    return {
      confidence: typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)
        ? Math.max(0, Math.min(1, parsed.confidence))
        : actions[0]?.confidence ?? 0.5,
      replyStyle: parsed.replyStyle === 'SHORT' || parsed.replyStyle === 'FRIENDLY' || parsed.replyStyle === 'NORMAL' ? parsed.replyStyle : 'NORMAL',
      actions: actions.length > 0 ? actions : [{ action: 'HELP', confidence: 0.3, replyStyle: 'NORMAL' }],
    };
  }

  async resolveWhatsappAction(input: string | ResolveWhatsappPlanInput): Promise<ResolvedWhatsappAction> {
    const plan = await this.resolveWhatsappPlan(input);
    return plan.actions[0] || {
      action: 'HELP',
      confidence: plan.confidence,
      replyStyle: plan.replyStyle,
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
    await prisma.overviewAnalysisCache.deleteMany({
      where: { userId },
    });
  }
}