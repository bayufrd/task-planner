import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { Router, Request, Response } from 'express';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { sendError, sendSuccess } from '../../lib/response';
import { AiService, type ResolvedWhatsappAction, type ResolvedWhatsappPlan } from '../ai/ai.service';
import { TaskService } from '../tasks/task.service';

const router = Router();
const aiService = new AiService();
const taskService = new TaskService();

type WhatsappIntent = 'REGISTER' | 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'LIST_TASKS' | 'LIST_BY_DATE' | 'COMPLETE_TASK' | 'OVERVIEW' | 'HELP' | 'UNKNOWN';

type WhatsappPersonalPayload = {
  nomor: string;
  pesan: string;
  lampiran?: string;
};

const MAX_WHATSAPP_ATTACHMENT_BYTES = 512 * 1024;

type WhatsappOutboundInfo = {
  attempted: boolean;
  sent: boolean;
  provider: string | null;
  number: string | null;
  channel: string;
  hasAttachment?: boolean;
  error?: string | null;
};

type WhatsappReplyPayload = {
  sent: boolean;
  number: string;
  message: string;
  type: string;
  attachmentPath?: string | null;
};

type WhatsappNumberSource = {
  field: string;
  raw: string;
  extracted: string;
  normalized: string | null;
  kind: 'phone' | 'jid' | 'lid' | 'unknown';
};

const extractWaNumber = (value?: string | null): string | null => {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits || null;
};

const classifyWhatsappIdentity = (value?: string | null): WhatsappNumberSource['kind'] => {
  if (!value) return 'unknown';

  const normalized = value.trim().toLowerCase();

  if (!normalized) return 'unknown';
  if (normalized.endsWith('@lid')) return 'lid';
  if (normalized.includes('@')) return 'jid';
  if (/^\+?\d+$/.test(normalized)) return 'phone';

  return 'unknown';
};

const normalizeSafeWhatsappNumber = (value?: string | null): string | null => {
  const digits = extractWaNumber(value);

  if (!digits) {
    return null;
  }

  if (digits.startsWith('62')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  return `62${digits}`;
};

const buildWhatsappNumberCandidates = (req: Request): WhatsappNumberSource[] => {
  const candidates: Array<{ field: string; raw: string }> = [
    {
      field: 'user.waNumber',
      raw: typeof req.body?.user?.waNumber === 'string' ? req.body.user.waNumber.trim() : '',
    },
    {
      field: 'user.senderPn',
      raw: typeof req.body?.user?.senderPn === 'string' ? req.body.user.senderPn.trim() : '',
    },
    {
      field: 'context.senderPn',
      raw: typeof req.body?.context?.senderPn === 'string' ? req.body.context.senderPn.trim() : '',
    },
    {
      field: 'message.senderPn',
      raw: typeof req.body?.message?.senderPn === 'string' ? req.body.message.senderPn.trim() : '',
    },
    {
      field: 'user.participant',
      raw: typeof req.body?.user?.participant === 'string' ? req.body.user.participant.trim() : '',
    },
    {
      field: 'user.chatId',
      raw: typeof req.body?.user?.chatId === 'string' ? req.body.user.chatId.trim() : '',
    },
    {
      field: 'context.remoteJid',
      raw: typeof req.body?.context?.remoteJid === 'string' ? req.body.context.remoteJid.trim() : '',
    },
  ];

  return candidates
    .filter((candidate) => candidate.raw)
    .map((candidate) => {
      const extracted = extractWaNumber(candidate.raw) || '';
      return {
        field: candidate.field,
        raw: candidate.raw,
        extracted,
        normalized: extracted ? normalizeSafeWhatsappNumber(extracted) : null,
        kind: classifyWhatsappIdentity(candidate.raw),
      };
    });
};

const resolveWhatsappNumber = (req: Request) => {
  const candidates = buildWhatsappNumberCandidates(req);
  const preferredCandidate = candidates.find((candidate) => candidate.kind !== 'lid' && candidate.normalized);
  const lidCandidate = candidates.find((candidate) => candidate.kind === 'lid');

  return {
    candidates,
    selected: preferredCandidate || null,
    rejectedLidCandidate: preferredCandidate ? null : lidCandidate || null,
  };
};

const buildWhatsappHelpMessage = (isRegistered: boolean): string => {
  const publicHelp = [
    'Bantuan command Smart Task Planner via WhatsApp:',
    '- daftar akun WA: user_id daftar',
    '- lihat bantuan: task bantuan',
    '- contoh tambah task: task tambah meeting besok jam 10 malam #urgent',
    '- contoh tambah task lain: task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan',
    '- daftar web: https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard',
  ];

  if (!isRegistered) {
    return [
      ...publicHelp,
      '',
      'Nomor Anda belum terhubung. Silakan daftar akun di web terlebih dahulu, lalu hubungkan WhatsApp dengan format: user_id daftar',
    ].join('\n');
  }

  return [
    ...publicHelp,
    '- lihat task aktif: task lihat jadwal',
    '- lihat task besok: task lihat jadwal besok',
    '- selesaikan task: task selesai meeting client',
    '- edit task: task ubah meeting besok jam 9 jadi jam 10',
    '- hapus task: task hapus meeting client',
    '- overview: task overview',
  ].join('\n');
};

const buildWhatsappEditGuideMessage = () =>
  [
    '✏️ Format edit task:',
    '- task ubah meeting besok jam 9 jadi jam 10',
    '- task edit laporan minggu ini jadi prioritas high',
    '- task reschedule presentasi besok ke lusa jam 3 sore',
    '',
    'Tips:',
    '- sebutkan nama task yang ingin diubah',
    '- tulis perubahan dengan jelas: jam, tanggal, prioritas, atau judul baru',
  ].join('\n');

const buildWhatsappDeleteGuideMessage = () =>
  [
    '🗑️ Format hapus task:',
    '- task hapus meeting client',
    '- task delete laporan besok jam 10',
    '- task remove presentasi senin pagi',
    '',
    'Tips:',
    '- sebutkan nama task sejelas mungkin',
    '- tambahkan petunjuk tanggal/jam bila ada task yang mirip',
  ].join('\n');

const buildWhatsappListGuideMessage = () =>
  [
    '📋 Format melihat task:',
    '- task daftar',
    '- task jadwal besok',
    '- task agenda hari ini',
    '- task lihat tanggal 20',
  ].join('\n');

const buildIntentGuideMessage = (intent: WhatsappIntent, isRegistered: boolean) => {
  if (intent === 'UPDATE_TASK') return buildWhatsappEditGuideMessage();
  if (intent === 'DELETE_TASK') return buildWhatsappDeleteGuideMessage();
  if (intent === 'LIST_TASKS' || intent === 'LIST_BY_DATE') return buildWhatsappListGuideMessage();
  return buildWhatsappHelpMessage(isRegistered);
};

const isHelpLikeQuestion = (command: string) => {
  const normalized = normalizeCommandText(command).toLowerCase();
  return /^(bantuan|help|menu|command|commands)$/.test(normalized)
    || /(cara|gimana|bagaimana|format|contoh|petunjuk|panduan).*(edit|ubah|update|reschedule)/.test(normalized)
    || /(edit|ubah|update|reschedule).*(cara|gimana|bagaimana|format|contoh|petunjuk|panduan)/.test(normalized)
    || /(cara|gimana|bagaimana|format|contoh|petunjuk|panduan).*(hapus|delete|remove)/.test(normalized)
    || /(hapus|delete|remove).*(cara|gimana|bagaimana|format|contoh|petunjuk|panduan)/.test(normalized)
    || /(cara|gimana|bagaimana|format|contoh|petunjuk|panduan).*(jadwal|daftar|list|agenda)/.test(normalized)
    || /(jadwal|daftar|list|agenda).*(cara|gimana|bagaimana|format|contoh|petunjuk|panduan)/.test(normalized);
};

const buildWhatsappRegistrationSuccessMessage = (name: string): string => {
  return [
    `Halo ${name}! Nomor WhatsApp Anda sudah berhasil terhubung ke Smart Task Planner by Dastrevas AI.`,
    '',
    'Mulai sekarang Anda bisa kirim perintah dengan awalan *task* untuk mengelola tugas langsung dari WhatsApp.',
    '',
    'Contoh cepat:',
    '- task tambah meeting besok jam 10 malam #urgent',
    '- task tanggal 10 ada meeting jam 9 malam di apartement #kerjaan',
    '',
    'AI kami dari dastrevas.com akan membantu membaca pesan Anda dan mengubahnya menjadi task dengan lebih akurat.',
    '',
    'Berikut bantuan command yang bisa Anda gunakan:',
    buildWhatsappHelpMessage(true),
  ].join('\n');
};

const formatTaskLine = (task: {
  title: string;
  deadline: Date;
  priority: string;
  status: string;
}) => {
  const formattedDate = task.deadline.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `• ${task.title} | ${formattedDate} | ${task.priority} | ${task.status}`;
};

const formatTaskSuccessLine = (task: {
  title: string;
  deadline: Date;
  priority: string;
  status: string;
}) => {
  const formattedDate = task.deadline.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return [
    `📝 ${task.title}`,
    `🕒 ${formattedDate}`,
    `⚡ ${task.priority}`,
    `📌 ${task.status}`,
  ].join('\n');
};

const normalizeCommandText = (command: string) =>
  command
    .trim()
    .replace(/^task\s+/i, '')
    .trim();

const normalizeComparableText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\b(tanggal|jam|pukul|hari|ini|besok|lusa|done|selesai|complete|task)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractDateTokens = (value: string): string[] => {
  const normalized = value.toLowerCase();
  const tokens = new Set<string>();
  const monthPattern = '(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|jan|feb|mar|apr|mei|jun|jul|agu|ags|sep|okt|nov|des)';

  if (normalized.includes('hari ini')) tokens.add('hari ini');
  if (normalized.includes('besok')) tokens.add('besok');
  if (normalized.includes('lusa')) tokens.add('lusa');

  const dayMonthMatches = normalized.match(new RegExp(`\\b\\d{1,2}\\s+${monthPattern}(?:\\s+\\d{4})?\\b`, 'gi')) || [];
  dayMonthMatches.forEach((match) => tokens.add(match.trim()));

  const tanggalMatches = normalized.match(/\btanggal\s+\d{1,2}\b/gi) || [];
  tanggalMatches.forEach((match) => tokens.add(match.trim()));

  const timeMatches = normalized.match(/\b(?:jam|pukul)\s+\d{1,2}(?:(?:\.|:)\d{2})?(?:\s*(?:pagi|siang|sore|malam))?\b/gi) || [];
  timeMatches.forEach((match) => tokens.add(match.trim()));

  return Array.from(tokens);
};

const taskMatchesDateTokens = (task: { deadline: Date }, tokens: string[]): boolean => {
  if (tokens.length === 0) return true;

  const deadline = new Date(task.deadline);
  const day = deadline.getDate();
  const year = deadline.getFullYear();
  const monthLong = deadline.toLocaleString('id-ID', { month: 'long' }).toLowerCase();
  const monthShort = deadline.toLocaleString('id-ID', { month: 'short' }).toLowerCase().replace('.', '');
  const hour = deadline.getHours();
  const minute = deadline.getMinutes();
  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);
  const taskDay = new Date(deadline);
  taskDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((taskDay.getTime() - baseToday.getTime()) / (24 * 60 * 60 * 1000));

  return tokens.every((token) => {
    if (token === 'hari ini') return diffDays === 0;
    if (token === 'besok') return diffDays === 1;
    if (token === 'lusa') return diffDays === 2;
    if (/^tanggal\s+\d{1,2}$/i.test(token)) {
      return day === Number(token.replace(/\D/g, ''));
    }
    if (/^(jam|pukul)\s+/i.test(token)) {
      const match = token.match(/(?:jam|pukul)\s+(\d{1,2})(?:[.:](\d{2}))?(?:\s*(pagi|siang|sore|malam))?/i);
      if (!match) return false;

      let parsedHour = Number(match[1]);
      const parsedMinute = match[2] ? Number(match[2]) : 0;
      const meridiem = match[3]?.toLowerCase();

      if (meridiem === 'siang' && parsedHour < 11) parsedHour += 12;
      if ((meridiem === 'sore' || meridiem === 'malam') && parsedHour < 12) parsedHour += 12;
      if (meridiem === 'pagi' && parsedHour === 12) parsedHour = 0;

      return hour === parsedHour && minute === parsedMinute;
    }

    const compact = token.replace(/\s+/g, ' ').trim();
    return (
      compact.includes(`${day} ${monthLong}`) ||
      compact.includes(`${day} ${monthShort}`) ||
      compact.includes(`${day} ${monthLong} ${year}`) ||
      compact.includes(`${day} ${monthShort} ${year}`)
    );
  });
};


const getWhatsappAuthToken = (): string => env.TOKEN_WHATSAPP || process.env.WHATSAPP_API_TOKEN || process.env.ADMIN_TOKEN || '';

const resolveAttachmentAbsolutePath = async (relativePath: string): Promise<{ absolutePath: string; size: number }> => {
  const candidatePaths = [
    path.resolve(process.cwd(), relativePath),
    path.resolve(process.cwd(), '..', relativePath),
    path.resolve(__dirname, '../../../../', relativePath),
    path.resolve(__dirname, '../../../../../', relativePath),
  ];

  for (const absolutePath of candidatePaths) {
    try {
      const fileStat = await stat(absolutePath);
      if (fileStat.isFile()) {
        return { absolutePath, size: fileStat.size };
      }
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  throw new Error(`WhatsApp attachment not found. Tried: ${candidatePaths.join(', ')}`);
};

const buildBase64Attachment = async (relativePath: string): Promise<string> => {
  const { absolutePath } = await resolveAttachmentAbsolutePath(relativePath);
  const fileBuffer = await readFile(absolutePath);
  return fileBuffer.toString('base64');
};

const buildSafeWhatsappAttachment = async (relativePath: string): Promise<string | null> => {
  const { size } = await resolveAttachmentAbsolutePath(relativePath);

  if (size > MAX_WHATSAPP_ATTACHMENT_BYTES) {
    return null;
  }

  return buildBase64Attachment(relativePath);
};

const sendWhatsappPersonalMessage = async (payload: WhatsappPersonalPayload): Promise<void> => {
  const token = getWhatsappAuthToken();

  if (!env.WHATSAPP_BOT_URL) {
    throw new Error('WHATSAPP_BOT_URL is not configured');
  }

  if (!token) {
    throw new Error('TOKEN_WHATSAPP is not configured');
  }

  const postPayload = async (bodyPayload: WhatsappPersonalPayload) => {
    const response = await fetch(`${env.WHATSAPP_BOT_URL}/api/whatsapp/send-personal`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const error = new Error(`Failed to send WhatsApp personal message: ${response.status} ${response.statusText} ${errorText}`.trim()) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }
  };

  try {
    await postPayload(payload);
  } catch (error: any) {
    if (error?.status === 413 && payload.lampiran) {
      await postPayload({ nomor: payload.nomor, pesan: payload.pesan });
      return;
    }

    throw error;
  }
};

const getAnimalLevelInfo = (score: number) => {
  if (score <= 10) return { name: 'Batu Rebahan', imagePath: 'public/leveling-wa/1.jpg', description: 'Hampir tidak bergerak, task cuma dilihat doang', tip: 'Mulai dari 1 task kecil dulu hari ini.' };
  if (score <= 20) return { name: 'Siput Loading', imagePath: 'public/leveling-wa/2.jpg', description: 'Ada niat, tapi progress lambat banget', tip: 'Kurangi penundaan dengan target pendek 15-30 menit.' };
  if (score <= 30) return { name: 'Kucing Mager', imagePath: 'public/leveling-wa/3.jpg', description: 'Mau produktif, tapi kasur lebih kuat', tip: 'Pilih 1 prioritas utama lalu selesaikan sebelum task lain.' };
  if (score <= 40) return { name: 'Panda Santuy', imagePath: 'public/leveling-wa/4.jpg', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', tip: 'Naikkan ritme dengan slot fokus tanpa distraksi.' };
  if (score <= 50) return { name: 'Badak Si Pemalas', imagePath: 'public/leveling-wa/5.jpg', description: 'Kuat sebenarnya, tapi susah mulai', tip: 'Jadwalkan task paling berat lebih awal.' };
  if (score <= 60) return { name: 'Bebek Mulai Jalan', imagePath: 'public/leveling-wa/6.jpg', description: 'Sudah mulai konsisten, walau masih goyang', tip: 'Jaga konsistensi dan tekan task skipped.' };
  if (score <= 70) return { name: 'Kelinci Si Rajin', imagePath: 'public/leveling-wa/7.jpg', description: 'Task mulai banyak selesai, ritme bagus', tip: 'Pertahankan ritme dan rapikan backlog pending.' };
  if (score <= 80) return { name: 'Semut Produktif', imagePath: 'public/leveling-wa/8.jpg', description: 'Rapi, konsisten, dan jarang skip', tip: 'Fokus pada task prioritas tinggi agar impact makin besar.' };
  if (score <= 90) return { name: 'Elang Fokus', imagePath: 'public/leveling-wa/9.jpg', description: 'Fokus tinggi, prioritas jelas', tip: 'Jaga kualitas eksekusi dan hindari overload.' };
  return { name: 'Naga Deadline', imagePath: 'public/leveling-wa/10.jpg', description: 'Mode legenda, task tunduk semua', tip: 'Pertahankan standar tinggi dan bantu backlog nol.' };
};

const buildOverviewMessage = async (userId: string, name?: string | null) => {
  const stats = await taskService.getTaskStats(userId);
  const dailyData = await taskService.getDailyTaskStats(userId, 7);
  const analysis = await aiService.analyzeOverview(userId, stats, dailyData).catch(() => null);
  const total = stats.pending + stats.done + stats.skipped;
  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;
  const skipRate = total > 0 ? Math.round((stats.skipped / total) * 100) : 0;
  const recentDays = dailyData.slice(-7);
  const activeDays = recentDays.filter((day) => day.count > 0).length;
  const bestDay = recentDays.reduce<{ date: string; count: number } | null>((best, day) => {
    if (!best || day.count > best.count) return day;
    return best;
  }, null);
  const insight = analysis?.insights?.[0] || 'Tetap konsisten menyelesaikan task prioritas tertinggi terlebih dahulu.';
  const secondInsight = analysis?.insights?.[1] || null;
  const primaryAdvice = analysis?.advice?.[0];
  const secondaryAdvice = analysis?.advice?.[1];
  const score = analysis?.score ?? completionRate;
  const animal = getAnimalLevelInfo(score);
  const level = Math.min(10, Math.max(1, Math.floor(score / 10) + 1));
  const progressToNextLevel = score >= 100 ? 10 : score % 10;

  const healthHighlight = total === 0
    ? 'Belum ada task tercatat. Mulai tambah task agar overview lebih akurat.'
    : stats.pending === 0
      ? 'Semua task aktif sudah beres. Momentum bagus.'
      : stats.pending >= Math.max(3, stats.done)
        ? 'Backlog pending lebih besar dari task selesai. Perlu bereskan prioritas utama.'
        : skipRate >= 30
          ? 'Task skipped cukup tinggi. Cek estimasi waktu dan deadline.'
          : 'Kondisi task relatif stabil. Tinggal jaga konsistensi.';

  const message = [
    `📊 Overview Task${name ? ` — ${name}` : ''}`,
    '',
    `🏆 Level: ${animal.name} (Level ${level})`,
    `🧠 Score: ${score}/100`,
    `📈 Selesai: ${completionRate}% | Skip: ${skipRate}%`,
    `📌 Total ${total} | Done ${stats.done} | Pending ${stats.pending} | Skipped ${stats.skipped}`,
    progressToNextLevel < 10 ? `⏫ Progress level berikutnya: ${progressToNextLevel}/10` : '👑 Level puncak tercapai.',
    '',
    `Highlight: ${healthHighlight}`,
    `Aktif 7 hari: ${activeDays}/7${bestDay && bestDay.count > 0 ? ` | Puncak: ${bestDay.count} task` : ''}`,
    '',
    `Insight: ${insight}`,
    secondInsight ? `Catatan: ${secondInsight}` : `Catatan: ${animal.description}`,
    '',
    'Tindak lanjut:',
    primaryAdvice ? `1. ${primaryAdvice.title}` : '1. Selesaikan 1 task prioritas tertinggi hari ini.',
    secondaryAdvice ? `2. ${secondaryAdvice.title}` : `2. ${animal.tip}`,
  ].filter(Boolean).join('\n');

  return {
    message,
    attachmentPath: analysis ? animal.imagePath : null,
    score,
    level: animal.name,
  };
};

const detectWhatsappIntent = (command: string): WhatsappIntent => {
  const normalized = command.trim().toLowerCase();
  const normalizedWithoutPrefix = normalized.replace(/^task\s+/i, '').trim();

  if (/^(\S+)\s+daftar$/i.test(command)) return 'REGISTER';
  if (isHelpLikeQuestion(normalizedWithoutPrefix)) return 'HELP';
  if (/^(overview|ringkasan|summary)$/i.test(normalizedWithoutPrefix)) return 'OVERVIEW';
  if (/^(lihat|list|daftar|jadwal|agenda).*(tanggal|besok|lusa|hari ini|today)/i.test(normalizedWithoutPrefix)) return 'LIST_BY_DATE';
  if (/^(lihat|list|daftar|jadwal|agenda)/i.test(normalizedWithoutPrefix)) return 'LIST_TASKS';
  if (/^(selesai|done|complete|tandai selesai)/i.test(normalizedWithoutPrefix)) return 'COMPLETE_TASK';
  if (/^(hapus|delete|remove)/i.test(normalizedWithoutPrefix)) return 'DELETE_TASK';
  if (/^(edit|ubah|update|reschedule)/i.test(normalizedWithoutPrefix)) return 'UPDATE_TASK';
  if (normalizedWithoutPrefix.length > 0) return 'CREATE_TASK';

  return 'UNKNOWN';
};

const resolveDateFilter = (command: string): { start: Date; end: Date; label: string } | null => {
  const lower = command.toLowerCase();
  const now = new Date();
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);

  if (lower.includes('hari ini') || lower.includes('today')) {
    const end = new Date(base);
    end.setHours(23, 59, 59, 999);
    return { start: base, end, label: 'hari ini' };
  }

  if (lower.includes('besok')) {
    const start = new Date(base);
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: 'besok' };
  }

  if (lower.includes('lusa')) {
    const start = new Date(base);
    start.setDate(start.getDate() + 2);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: 'lusa' };
  }

  const tanggalMatch = lower.match(/tanggal\s+(\d{1,2})/i);
  if (tanggalMatch) {
    const day = Number(tanggalMatch[1]);
    if (day >= 1 && day <= 31) {
      const start = new Date(base.getFullYear(), base.getMonth(), day, 0, 0, 0, 0);
      if (start.getDate() !== day) return null;
      if (start < base) {
        start.setMonth(start.getMonth() + 1);
      }
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: `tanggal ${day}` };
    }
  }

  return null;
};

const buildListMessage = async (userId: string, command: string, name?: string | null) => {
  const dateFilter = resolveDateFilter(command);
  const tasks = await taskService.getTasks(userId);
  const filteredTasks = dateFilter
    ? tasks.filter((task) => task.deadline >= dateFilter.start && task.deadline <= dateFilter.end)
    : tasks;

  if (filteredTasks.length === 0) {
    return dateFilter
      ? `📭 Tidak ada task untuk ${dateFilter.label}${name ? `, ${name}` : ''}.`
      : `📭 Tidak ada task aktif${name ? ` untuk ${name}` : ''}.`;
  }

  const header = dateFilter
    ? `📅 Daftar task ${dateFilter.label}${name ? ` untuk ${name}` : ''}:`
    : `📋 Daftar task aktif${name ? ` untuk ${name}` : ''}:`;

  return [header, ...filteredTasks.slice(0, 10).map(formatTaskLine)].join('\n');
};

const extractCompletionTitle = (command: string) =>
  normalizeCommandText(command)
    .replace(/^(selesai|done|complete|tandai selesai)\s*/i, '')
    .trim();

const findBestTaskMatch = async (
  userId: string,
  targetText?: string,
  dateHint?: string
) => {
  const tasks = await taskService.getTasks(userId, 'PENDING');
  const normalizedTarget = normalizeComparableText(targetText || '');
  const normalizedCombined = normalizeComparableText([targetText, dateHint].filter(Boolean).join(' ').trim());
  const dateTokens = extractDateTokens(dateHint || '');

  const scoreFromText = (candidate: string, comparableTitle: string) => {
    if (!candidate) return 0;

    let score = 0;
    if (comparableTitle === candidate) score += 100;
    else if (comparableTitle.includes(candidate)) score += 80;
    else if (candidate.includes(comparableTitle)) score += 60;

    const words = candidate.split(' ').filter(Boolean);
    score += words.filter((word) => comparableTitle.includes(word)).length * 10;
    return score;
  };

  const scored = tasks
    .map((task) => {
      const comparableTitle = normalizeComparableText(task.title);
      let score = 0;

      score += scoreFromText(normalizedTarget, comparableTitle) * 2;

      if (!score && !normalizedTarget && normalizedCombined) {
        score += scoreFromText(normalizedCombined, comparableTitle);
      }

      if (taskMatchesDateTokens(task, dateTokens)) {
        score += dateTokens.length > 0 ? 30 : 0;
      } else if (dateTokens.length > 0) {
        score -= 20;
      }

      return { task, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(a.task.deadline).getTime() - new Date(b.task.deadline).getTime());

  return {
    tasks,
    bestMatch: scored[0]?.task || null,
    alternatives: scored.slice(0, 5).map((item) => item.task),
  };
};

const buildTaskNotFoundMessage = (actionLabel: string, targetText?: string, dateHint?: string) => {
  const clues = [targetText, dateHint].filter(Boolean).join(' ').trim();
  return [
    `⚠️ Task untuk ${actionLabel} tidak ditemukan.`,
    clues ? `🔎 Pencarian: ${clues}` : '🔎 AI belum menemukan task yang dimaksud.',
    'Coba tulis lebih spesifik, misalnya: selesai meeting client besok jam 9',
  ].join('\n');
};

const sanitizeTaskUpdateInput = (updates?: ResolvedWhatsappAction['updates']) => {
  if (!updates) return {};

  return Object.fromEntries(
    Object.entries({
      title: updates.title?.trim() || undefined,
      description: typeof updates.description === 'string' ? updates.description.trim() : undefined,
      deadline: updates.deadline || undefined,
      priority: updates.priority,
      estimatedDuration: typeof updates.estimatedDuration === 'number' ? updates.estimatedDuration : undefined,
      reminderTime: typeof updates.reminderTime === 'number' ? updates.reminderTime : undefined,
      tags: Array.isArray(updates.tags) ? updates.tags : undefined,
    }).filter(([, value]) => value !== undefined)
  );
};

const handleTaskCompletion = async (userId: string, command: string, name?: string | null) => {
  const rawTitle = extractCompletionTitle(command);
  if (!rawTitle) {
    return {
      reply: '⚠️ Format selesai belum lengkap. Contoh: selesai meeting client',
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'MISSING_TITLE' },
    };
  }

  const tasks = await taskService.getTasks(userId);
  const comparableTitle = normalizeComparableText(rawTitle);
  const dateTokens = extractDateTokens(rawTitle);

  const scoredMatches = tasks
    .map((task) => {
      const taskComparableTitle = normalizeComparableText(task.title);
      const titleMatch =
        taskComparableTitle.includes(comparableTitle) ||
        comparableTitle.includes(taskComparableTitle) ||
        comparableTitle.split(' ').every((part) => part && taskComparableTitle.includes(part));
      const dateMatch = taskMatchesDateTokens(task, dateTokens);
      const score = (titleMatch ? 2 : 0) + (dateMatch ? 1 : 0);

      return {
        task,
        titleMatch,
        dateMatch,
        score,
      };
    })
    .filter((item) => item.titleMatch)
    .sort((a, b) => b.score - a.score || a.task.deadline.getTime() - b.task.deadline.getTime());

  const exactDateMatches = scoredMatches.filter((item) => item.dateMatch);
  const matchedTasks = (exactDateMatches.length > 0 ? exactDateMatches : scoredMatches).map((item) => item.task);

  if (matchedTasks.length === 0) {
    return {
      reply: [`❌ Task dengan kata kunci "${rawTitle}" tidak ditemukan.`, 'Coba gunakan judul yang lebih dekat dengan nama task.'].join('\n'),
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'TASK_NOT_FOUND', keyword: rawTitle },
    };
  }

  if (matchedTasks.length > 1) {
    return {
      reply: ['🤔 Saya menemukan lebih dari satu task. Mohon lebih spesifik ya:', ...matchedTasks.slice(0, 5).map(formatTaskLine)].join('\n'),
      operation: { success: false, type: 'COMPLETE_TASK', reason: 'AMBIGUOUS_TASK', keyword: rawTitle, matches: matchedTasks.slice(0, 5) },
    };
  }

  const updatedTask = await taskService.updateTaskStatus(userId, matchedTasks[0].id, { status: 'DONE' });

  return {
    reply: [`✅ Task berhasil ditandai selesai${name ? ` untuk ${name}` : ''}:`, formatTaskSuccessLine(updatedTask)].join('\n'),
    operation: { success: true, type: 'COMPLETE_TASK', task: updatedTask },
  };
};

const handleWhatsappInbound = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[WA Inbound] Request received', {
      source: typeof req.body?.source === 'string' ? req.body.source.trim() : '',
      service: typeof req.body?.service === 'string' ? req.body.service.trim() : '',
      command: typeof req.body?.command === 'string' ? req.body.command.trim() : '',
      rawMessage: typeof req.body?.rawMessage === 'string' ? req.body.rawMessage.trim() : '',
      user: req.body?.user || null,
      message: req.body?.message || null,
      context: req.body?.context || null,
    });

    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.substring(7).trim()
    : '';
  const serviceSecret = String(req.headers['x-service-secret'] || '').trim();

  if (!env.TOKEN_WHATSAPP) {
    sendError(res, 'CONFIG_ERROR', 'TOKEN_WHATSAPP is not configured', 500);
    return;
  }

  if (bearerToken !== env.TOKEN_WHATSAPP || serviceSecret !== env.TOKEN_WHATSAPP) {
    console.log('[WA Inbound] Unauthorized request', {
      hasBearer: Boolean(bearerToken),
      hasServiceSecret: Boolean(serviceSecret),
    });
    sendError(res, 'UNAUTHORIZED', 'Invalid service secret', 401);
    return;
  }

  const command = typeof req.body?.command === 'string' ? req.body.command.trim() : '';
  const rawMessage = typeof req.body?.rawMessage === 'string' ? req.body.rawMessage.trim() : '';
  const source = typeof req.body?.source === 'string' ? req.body.source.trim() : '';
  const service = typeof req.body?.service === 'string' ? req.body.service.trim() : '';
  const messageBody = typeof req.body?.message?.body === 'string' ? req.body.message.body.trim() : '';
  const participant = typeof req.body?.user?.participant === 'string' ? req.body.user.participant : '';
  const chatId = typeof req.body?.user?.chatId === 'string' ? req.body.user.chatId : '';
  const remoteJid = typeof req.body?.context?.remoteJid === 'string' ? req.body.context.remoteJid : '';
  const senderPn =
    typeof req.body?.user?.senderPn === 'string'
      ? req.body.user.senderPn
      : typeof req.body?.context?.senderPn === 'string'
        ? req.body.context.senderPn
        : typeof req.body?.message?.senderPn === 'string'
          ? req.body.message.senderPn
          : '';
  const numberResolution = resolveWhatsappNumber(req);
  const selectedNumberSource = numberResolution.selected;
  const waNumber = selectedNumberSource?.extracted || null;

  if (!command) {
    console.log('[WA Inbound] Validation failed: command is required');
    sendError(res, 'VALIDATION_ERROR', 'command is required', 400);
    return;
  }

  if (!waNumber) {
    console.log('[WA Inbound] Validation failed: WA number unresolved', {
      candidates: numberResolution.candidates,
      rejectedLidCandidate: numberResolution.rejectedLidCandidate,
    });
    sendError(
      res,
      'VALIDATION_ERROR',
      numberResolution.rejectedLidCandidate
        ? 'Unable to resolve WhatsApp number from payload because only @lid identity was provided'
        : 'Unable to resolve WhatsApp number from payload',
      400
    );
    return;
  }

  const normalizedWaNumber = selectedNumberSource?.normalized || normalizeSafeWhatsappNumber(waNumber);

  const commandMatch = command.match(/^(\S+)\s+daftar$/i);
  const taskPlannerUserId = commandMatch?.[1] || null;
  const intent = detectWhatsappIntent(command);
  const registrationCommand = intent === 'REGISTER';

  console.log('[WA Inbound] Command parsed', {
    waNumber,
    normalizedWaNumber,
    numberSource: selectedNumberSource?.field || null,
    numberSourceKind: selectedNumberSource?.kind || null,
    command,
    taskPlannerUserId,
    intent,
    registrationCommand,
  });

  let registration = null;
  let registrationNotification: null | { sent: boolean; number: string; type: string; message?: string } = null;
  let whatsappReply: WhatsappReplyPayload | null = null;
  let operation: Record<string, unknown> | null = null;

  if (taskPlannerUserId) {
    const safeWhatsappNumber = normalizeSafeWhatsappNumber(waNumber);

    if (!safeWhatsappNumber) {
      sendError(res, 'VALIDATION_ERROR', 'Unable to normalize WhatsApp number', 400);
      return;
    }

    console.log('[WA Registration] Processing registration', {
      taskPlannerUserId,
      safeWhatsappNumber,
      chatId,
    });

    const existingUser = await prisma.user.findUnique({
      where: { id: taskPlannerUserId },
      select: {
        id: true,
        name: true,
        email: true,
        whatsappNumber: true,
        whatsappChatId: true,
        updatedAt: true,
      },
    });

    if (!existingUser) {
      console.log('[WA Registration] User not found', {
        taskPlannerUserId,
        safeWhatsappNumber,
      });
      const notRegisteredMessage =
        'user id tidak terdaftar pada Task Planner silahkan daftar dengan mengunjungi https://taskplanner.dastrevas.com/auth/signup?callbackUrl=%2Fdashboard';

      registrationNotification = {
        sent: false,
        number: safeWhatsappNumber,
        type: 'user-not-found',
        message: notRegisteredMessage,
      };

      registration = {
        linked: false,
        reason: 'USER_NOT_FOUND',
        userId: taskPlannerUserId,
      };
    } else if (existingUser.whatsappNumber) {
      console.log('[WA Registration] User already has WhatsApp number', {
        taskPlannerUserId,
        existingWhatsappNumber: existingUser.whatsappNumber,
      });
      const alreadyRegisteredMessage = `user untuk ${taskPlannerUserId} atas nama ${existingUser.name} sudah terdaftar`;

      registrationNotification = {
        sent: false,
        number: safeWhatsappNumber,
        type: 'already-registered',
        message: alreadyRegisteredMessage,
      };

      registration = {
        linked: false,
        reason: 'WHATSAPP_ALREADY_REGISTERED',
        user: existingUser,
      };
    } else {
      const existingWhatsappOwner = await prisma.user.findFirst({
        where: {
          whatsappNumber: safeWhatsappNumber,
          NOT: { id: taskPlannerUserId },
        },
        select: { id: true },
      });

      if (existingWhatsappOwner) {
        console.log('[WA Registration] Conflict: WhatsApp number already owned by another user', {
          taskPlannerUserId,
          safeWhatsappNumber,
          ownerId: existingWhatsappOwner.id,
        });
        sendError(res, 'CONFLICT', 'WhatsApp number is already registered to another user', 409);
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: taskPlannerUserId },
        data: {
          whatsappNumber: safeWhatsappNumber,
          whatsappChatId: chatId || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          whatsappNumber: true,
          whatsappChatId: true,
          updatedAt: true,
        },
      });

      console.log('[WA Registration] Registration linked successfully', {
        taskPlannerUserId,
        safeWhatsappNumber,
        linkedUserId: updatedUser.id,
      });

      registration = {
        linked: true,
        user: updatedUser,
      };

      const registrationSuccessMessage = buildWhatsappRegistrationSuccessMessage(
        updatedUser.name || req.body?.user?.name || 'User'
      );

      registrationNotification = {
        sent: false,
        number: safeWhatsappNumber,
        type: 'registration-success',
        message: registrationSuccessMessage,
      };
    }
  }

  if (!registrationCommand) {
    console.log('[WA Command] Processing non-registration command', {
      command,
      intent,
      waNumber,
    });
    const safeWhatsappNumber = normalizeSafeWhatsappNumber(waNumber);

    if (!safeWhatsappNumber) {
      sendError(res, 'VALIDATION_ERROR', 'Unable to normalize WhatsApp number', 400);
      return;
    }

    const linkedUser = await prisma.user.findFirst({
      where: { whatsappNumber: safeWhatsappNumber },
      select: {
        id: true,
        name: true,
        whatsappNumber: true,
      },
    });

    if (!linkedUser) {
      console.log('[WA Command] Number is not linked to any user', {
        safeWhatsappNumber,
        command,
      });
      const helpMessage = buildWhatsappHelpMessage(false);
      const unregisteredMessage = `Nomor WhatsApp ini belum terhubung ke Task Planner.\n\n${helpMessage}`;

      whatsappReply = {
        sent: false,
        number: safeWhatsappNumber,
        message: unregisteredMessage,
        type: 'number-not-registered',
      };

      operation = {
        type: intent,
        success: false,
        reason: 'WHATSAPP_NUMBER_NOT_REGISTERED',
      };
    } else {
      console.log('[WA Command] Linked user found', {
        userId: linkedUser.id,
        userName: linkedUser.name,
        intent,
      });

      let replyMessage = '';
      let resolvedPlan: ResolvedWhatsappPlan | null = null;

      try {
        resolvedPlan = await aiService.resolveWhatsappPlan({
          command,
          waNumber: normalizedWaNumber || undefined,
        });
      } catch (error) {
        console.error('[WA AI] Failed to resolve action plan, fallback to rule-based intent:', error);
      }

      const fallbackAction: ResolvedWhatsappAction = {
        action: intent === 'UNKNOWN' ? 'HELP' : intent,
        confidence: 0.4,
        replyStyle: 'NORMAL',
      };

      const explicitHelpRequest = isHelpLikeQuestion(command);
      const actions = resolvedPlan?.actions?.length ? resolvedPlan.actions : [fallbackAction];
      const replies: string[] = [];
      const operationResults: Array<Record<string, unknown>> = [];

      console.log('[WA Command] Resolved action plan', {
        userId: linkedUser.id,
        command,
        fallbackIntent: intent,
        planConfidence: resolvedPlan?.confidence ?? null,
        actionCount: actions.length,
        actions: actions.map((item) => ({
          action: item.action,
          confidence: item.confidence,
          targetText: item.targetText ?? null,
          dateHint: item.dateHint ?? null,
        })),
      });

      for (const resolvedAction of actions) {
        const action = resolvedAction.action || fallbackAction.action;
        let actionReply = '';
        let actionOperation: Record<string, unknown> = {
          type: action,
          success: false,
          userId: linkedUser.id,
          resolvedAction,
        };

        if (action === 'LIST_TASKS' || action === 'LIST_BY_DATE') {
          const listCommand = [resolvedAction.targetText, resolvedAction.dateHint].filter(Boolean).join(' ').trim() || command;
          actionReply = await buildListMessage(linkedUser.id, listCommand, linkedUser.name);
          actionOperation = {
            type: action,
            success: true,
            userId: linkedUser.id,
            resolvedAction,
          };
        } else if (action === 'OVERVIEW') {
          const overviewResult = await buildOverviewMessage(linkedUser.id, linkedUser.name);
          actionReply = overviewResult.message;
          actionOperation = {
            type: 'OVERVIEW',
            success: true,
            userId: linkedUser.id,
            resolvedAction,
            attachmentPath: overviewResult.attachmentPath,
            score: overviewResult.score,
            level: overviewResult.level,
          };
        } else if (action === 'COMPLETE_TASK') {
          if (resolvedAction.targetText || resolvedAction.dateHint) {
            const match = await findBestTaskMatch(linkedUser.id, resolvedAction.targetText, resolvedAction.dateHint);

            if (!match.bestMatch) {
              actionReply = buildTaskNotFoundMessage('diselesaikan', resolvedAction.targetText, resolvedAction.dateHint);
              actionOperation = {
                type: 'COMPLETE_TASK',
                success: false,
                userId: linkedUser.id,
                resolvedAction,
                reason: 'TASK_NOT_FOUND',
              };
            } else {
              const updatedTask = await taskService.updateTaskStatus(linkedUser.id, match.bestMatch.id, { status: 'DONE' });
              actionReply = [
                `✅ Task berhasil diselesaikan${linkedUser.name ? ` untuk ${linkedUser.name}` : ''}:`,
                formatTaskSuccessLine(updatedTask),
              ].join('\n');
              actionOperation = {
                type: 'COMPLETE_TASK',
                success: true,
                userId: linkedUser.id,
                resolvedAction,
                task: updatedTask,
              };
            }
          } else {
            const completionResult = await handleTaskCompletion(linkedUser.id, command, linkedUser.name);
            actionReply = completionResult.reply;
            actionOperation = {
              ...completionResult.operation,
              userId: linkedUser.id,
              resolvedAction,
            };
          }
        } else if (action === 'DELETE_TASK') {
          const match = await findBestTaskMatch(linkedUser.id, resolvedAction.targetText, resolvedAction.dateHint);

          if (!match.bestMatch) {
            actionReply = buildTaskNotFoundMessage('dihapus', resolvedAction.targetText, resolvedAction.dateHint);
            actionOperation = {
              type: 'DELETE_TASK',
              success: false,
              userId: linkedUser.id,
              resolvedAction,
              reason: 'TASK_NOT_FOUND',
            };
          } else {
            await taskService.deleteTask(linkedUser.id, match.bestMatch.id);
            actionReply = [
              `🗑️ Task berhasil dihapus${linkedUser.name ? ` untuk ${linkedUser.name}` : ''}:`,
              formatTaskSuccessLine(match.bestMatch),
            ].join('\n');
            actionOperation = {
              type: 'DELETE_TASK',
              success: true,
              userId: linkedUser.id,
              resolvedAction,
              task: match.bestMatch,
            };
          }
        } else if (action === 'UPDATE_TASK') {
          if (explicitHelpRequest) {
            actionReply = buildWhatsappEditGuideMessage();
            actionOperation = {
              type: 'HELP',
              success: true,
              userId: linkedUser.id,
              resolvedAction,
              reason: 'EDIT_GUIDE',
            };
          } else {
            const match = await findBestTaskMatch(linkedUser.id, resolvedAction.targetText, resolvedAction.dateHint);
            const updateInput = sanitizeTaskUpdateInput(resolvedAction.updates) as Record<string, unknown>;
 
            if (!match.bestMatch) {
              actionReply = buildTaskNotFoundMessage('diedit', resolvedAction.targetText, resolvedAction.dateHint);
              actionOperation = {
                type: 'UPDATE_TASK',
                success: false,
                userId: linkedUser.id,
                resolvedAction,
                reason: 'TASK_NOT_FOUND',
              };
            } else if (Object.keys(updateInput).length === 0) {
              actionReply = buildWhatsappEditGuideMessage();
              actionOperation = {
                type: 'UPDATE_TASK',
                success: false,
                userId: linkedUser.id,
                resolvedAction,
                reason: 'EMPTY_UPDATE',
              };
            } else {
              const updatedTask = await taskService.updateTask(linkedUser.id, match.bestMatch.id, updateInput as any);
              actionReply = [
                `✏️ Task berhasil diperbarui${linkedUser.name ? ` untuk ${linkedUser.name}` : ''}:`,
                formatTaskSuccessLine(updatedTask),
              ].join('\n');
              actionOperation = {
                type: 'UPDATE_TASK',
                success: true,
                userId: linkedUser.id,
                resolvedAction,
                task: updatedTask,
                updates: updateInput,
              };
            }
          }
        } else if (action === 'CREATE_TASK') {
          const taskCommand = normalizeCommandText(command);
          console.log('[WA Command] Executing CREATE_TASK', { userId: linkedUser.id, command: taskCommand });
          
          const aiParsedTask = await aiService.parseTaskCommand(taskCommand);
          console.log('[WA Command] AI Parsed Task', { userId: linkedUser.id, aiParsedTask });

          const parsedTask = resolvedAction.updates?.title
            ? {
                ...aiParsedTask,
                ...resolvedAction.updates,
                title: resolvedAction.updates.title || aiParsedTask.title,
                description: resolvedAction.updates.description ?? aiParsedTask.description,
                deadline: aiParsedTask.deadline,
                priority: resolvedAction.updates.priority || aiParsedTask.priority,
                estimatedDuration: resolvedAction.updates.estimatedDuration || aiParsedTask.estimatedDuration,
                tags: resolvedAction.updates.tags?.length ? resolvedAction.updates.tags : aiParsedTask.tags,
                reminderTime: resolvedAction.updates.reminderTime ?? aiParsedTask.reminderTime,
              }
            : aiParsedTask;
          
          console.log('[WA Command] Final Parsed Task for Creation', { userId: linkedUser.id, parsedTask });

          const createdTask = await taskService.createTask(linkedUser.id, parsedTask);
          console.log('[WA Command] Task created successfully', { userId: linkedUser.id, taskId: createdTask.id });

          actionReply = [
            `✅ Task berhasil dibuat${linkedUser.name ? ` untuk ${linkedUser.name}` : ''}:`,
            formatTaskSuccessLine(createdTask),
          ].join('\n');
          actionOperation = {
            type: 'CREATE_TASK',
            success: true,
            userId: linkedUser.id,
            resolvedAction,
            parsedTask,
            task: createdTask,
          };
        } else {
          actionReply = buildIntentGuideMessage(intent, true);
          actionOperation = {
            type: action === 'HELP' ? 'HELP' : 'UNKNOWN',
            success: true,
            userId: linkedUser.id,
            resolvedAction,
            reason: explicitHelpRequest ? 'HELP_QUERY' : 'HELP_MENU',
          };
        }

        replies.push(actionReply);
        operationResults.push(actionOperation);
      }

      replyMessage = replies.filter(Boolean).join('\n\n');
      operation = {
        type: operationResults.length > 1 ? 'MULTI_ACTION' : String(operationResults[0]?.type || fallbackAction.action),
        success: operationResults.every((item) => item.success !== false),
        partialSuccess: operationResults.some((item) => item.success === false) && operationResults.some((item) => item.success === true),
        userId: linkedUser.id,
        resolvedPlan,
        operations: operationResults,
        actionCount: operationResults.length,
      };

      console.log('[WA Command] Reply prepared', {
        userId: linkedUser.id,
        intent,
        operationType: operation && 'type' in operation ? operation.type : null,
        preview: replyMessage.slice(0, 200),
      });

      const overviewOperation = operationResults.find((item) => item.type === 'OVERVIEW');
      const attachmentPath = typeof overviewOperation?.attachmentPath === 'string' ? overviewOperation.attachmentPath : null;

      whatsappReply = {
        sent: false,
        number: safeWhatsappNumber,
        message: replyMessage,
        type: String((operation && 'type' in operation ? operation.type : fallbackAction.action) || intent).toLowerCase(),
        attachmentPath,
      };
    }
  }

  const finalMessage = whatsappReply?.message || registrationNotification?.message || null;
  const finalReplyType = whatsappReply?.type || registrationNotification?.type || null;
  const outboundNumber = whatsappReply?.number || registrationNotification?.number || null;
  let outbound: WhatsappOutboundInfo = {
    attempted: false,
    sent: false,
    provider: null,
    number: outboundNumber,
    channel: 'sync-response-only',
  };

  if (whatsappReply?.attachmentPath && outboundNumber) {
    outbound = {
      attempted: true,
      sent: false,
      provider: 'whatsapp-personal-api',
      number: outboundNumber,
      channel: 'async-media-follow-up',
      hasAttachment: true,
      error: null,
    };

    try {
      const lampiran = await buildSafeWhatsappAttachment(whatsappReply.attachmentPath);
      await sendWhatsappPersonalMessage(
        lampiran
          ? {
              nomor: outboundNumber,
              pesan: `🏆 Visual level produktivitas Anda hari ini. Cocokkan dengan overview di atas untuk tindakan berikutnya.`,
              lampiran,
            }
          : {
              nomor: outboundNumber,
              pesan: `📊 Overview berhasil dibuat. Visual level dilewati karena ukuran lampiran terlalu besar untuk gateway saat ini.`,
            },
      );
      whatsappReply.sent = true;
      outbound.sent = true;
      outbound.hasAttachment = Boolean(lampiran);
    } catch (error) {
      outbound.error = error instanceof Error ? error.message : 'Failed to send overview attachment';
      console.error('[WA Overview] Failed to send attachment follow-up', {
        number: outboundNumber,
        attachmentPath: whatsappReply.attachmentPath,
        error,
      });
    }
  }

  const normalizedPayload = {
    source,
    service,
    command,
    rawMessage,
    registrationCommand,
    taskPlannerUserId,
    user: {
      waNumber: normalizedWaNumber || waNumber,
      name: typeof req.body?.user?.name === 'string' ? req.body.user.name : null,
      chatId: chatId || null,
      participant: participant || null,
      senderPn: senderPn || null,
      isGroup: Boolean(req.body?.user?.isGroup),
    },
    message: {
      id: typeof req.body?.message?.id === 'string' ? req.body.message.id : null,
      timestamp: typeof req.body?.message?.timestamp === 'string' ? req.body.message.timestamp : null,
      body: messageBody || null,
    },
    context: {
      groupId: typeof req.body?.context?.groupId === 'string' ? req.body.context.groupId : null,
      remoteJid: remoteJid || null,
      pushName: typeof req.body?.context?.pushName === 'string' ? req.body.context.pushName : null,
      senderPn: typeof req.body?.context?.senderPn === 'string' ? req.body.context.senderPn : null,
      senderIsAdmin: Boolean(req.body?.context?.senderIsAdmin),
    },
    numberResolution: {
      source: selectedNumberSource?.field || null,
      sourceKind: selectedNumberSource?.kind || null,
      rejectedLidCandidate: numberResolution.rejectedLidCandidate
        ? {
            field: numberResolution.rejectedLidCandidate.field,
            raw: numberResolution.rejectedLidCandidate.raw,
          }
        : null,
      candidates: numberResolution.candidates.map((candidate) => ({
        field: candidate.field,
        kind: candidate.kind,
        raw: candidate.raw,
        normalized: candidate.normalized,
      })),
    },
    receivedAt: new Date().toISOString(),
    reply: finalMessage
      ? {
          message: finalMessage,
          type: finalReplyType,
          channel: 'double-response',
          source: 'app-sync-response',
        }
      : null,
    outbound,
    registration,
    registrationNotification,
    intent,
    operation,
    whatsappReply,
  };

  console.log('[WA Inbound] Returning success response', {
    command,
    intent,
    registrationCommand,
    hasRegistration: Boolean(registration),
    hasOperation: Boolean(operation),
    whatsappReplySent: whatsappReply?.sent ?? registrationNotification?.sent ?? null,
  });

  sendSuccess(
    res,
    normalizedPayload,
    finalMessage || (registrationCommand ? 'WhatsApp registration captured and saved' : 'WhatsApp inbound command processed'),
    201
  );
  } catch (error) {
    console.error('[WA Inbound] CRITICAL ERROR:', error);
    if (!res.headersSent) {
      sendError(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to process WhatsApp inbound request', 500);
    }
  }
};

router.post('/inbound', handleWhatsappInbound);

export default router;
