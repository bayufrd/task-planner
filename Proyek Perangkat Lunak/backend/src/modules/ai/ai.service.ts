import { env } from '../../config/env';

export interface ParsedTaskCommand {
  title: string;
  description?: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDuration: number;
  tags: string[];
  reminderTime: number;
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
        temperature: 0.1,
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
              timezoneOffsetMinutes: now.getTimezoneOffset(),
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

    return {
      title: parsed.title.trim(),
      description: typeof parsed.description === 'string' ? parsed.description.trim() : '',
      deadline: deadline.toISOString(),
      priority: normalizePriority(parsed.priority),
      estimatedDuration: normalizeDuration(parsed.estimatedDuration),
      tags: normalizeTags(parsed.tags),
      reminderTime: normalizeReminderTime(parsed.reminderTime),
    };
  }
}