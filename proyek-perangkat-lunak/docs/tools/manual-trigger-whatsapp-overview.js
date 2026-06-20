#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

const projectRoot = path.resolve(__dirname, '..', '..');
const backendEnvPath = path.resolve(projectRoot, 'backend/.env');
const rootEnvPath = path.resolve(projectRoot, '.env');
const rootEnvLocalPath = path.resolve(projectRoot, '.env.local');

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: rootEnvLocalPath, override: true });
dotenv.config({ path: backendEnvPath, override: true });

const DEFAULT_TIMEZONE = 'Asia/Jakarta';
const DEFAULT_NUMBER = '6282177177767';
const DEFAULT_IMAGE_BASE = 'public/leveling-wa';
const MAX_WHATSAPP_ATTACHMENT_BYTES = 512 * 1024;
const OVERVIEW_CAPTION_BATCH_THRESHOLD = 750;
const OVERVIEW_TEXT_BATCH_THRESHOLD = 1500;

function printHelp() {
  console.log(`Manual trigger WhatsApp Overview
Reads env automatically from:
  1. proyek-perangkat-lunak/.env
  2. proyek-perangkat-lunak/.env.local
  3. proyek-perangkat-lunak/backend/.env
Later file overrides earlier file.

Usage:
  node docs/tools/manual-trigger-whatsapp-overview.js [options]

Options:
  --send                 Actually send WhatsApp overview. Default: dry-run only.
  --user-id=<id>         Use specific Task Planner user ID.
  --number=<number>      Target WhatsApp number. Default: ${DEFAULT_NUMBER}
  --no-image             Send text only without lampiran.
  --dry-run              Force dry-run mode.
  --help                 Show this help.

Env used:
  DATABASE_URL
  WHATSAPP_BOT_URL
  TOKEN_WHATSAPP
  WHATSAPP_API_TOKEN
  ADMIN_TOKEN
  NINE_ROUTER_API
  NINE_ROUTER_API_KEY
  NINE_ROUTER_MODEL
`);
}

function parseArgs(argv) {
  const options = {
    send: false,
    userId: '',
    number: DEFAULT_NUMBER,
    noImage: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--send') options.send = true;
    else if (arg === '--dry-run') options.send = false;
    else if (arg === '--no-image') options.noImage = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--user-id=')) options.userId = arg.slice('--user-id='.length).trim();
    else if (arg.startsWith('--number=')) options.number = normalizeWhatsappNumber(arg.slice('--number='.length));
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function normalizeWhatsappNumber(input) {
  const digits = String(input || '').replace(/[^\d]/g, '').trim();
  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

function getConfig() {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (!databaseUrl) {
    throw new Error(`DATABASE_URL missing. Checked ${rootEnvPath}, ${rootEnvLocalPath}, ${backendEnvPath}`);
  }

  const parsed = new URL(databaseUrl);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  };
}

function getAuthToken() {
  return process.env.TOKEN_WHATSAPP || process.env.WHATSAPP_API_TOKEN || process.env.ADMIN_TOKEN || '';
}

function getLevelInfo(score) {
  if (score <= 10) return { name: 'Batu Rebahan', imagePath: `${DEFAULT_IMAGE_BASE}/1.jpg`, description: 'Hampir tidak bergerak, task cuma dilihat doang', tip: 'Mulai dari 1 task kecil dulu hari ini.' };
  if (score <= 20) return { name: 'Siput Loading', imagePath: `${DEFAULT_IMAGE_BASE}/2.jpg`, description: 'Ada niat, tapi progress lambat banget', tip: 'Kurangi penundaan dengan target pendek 15-30 menit.' };
  if (score <= 30) return { name: 'Kucing Mager', imagePath: `${DEFAULT_IMAGE_BASE}/3.jpg`, description: 'Mau produktif, tapi kasur lebih kuat', tip: 'Pilih 1 prioritas utama lalu selesaikan sebelum task lain.' };
  if (score <= 40) return { name: 'Panda Santuy', imagePath: `${DEFAULT_IMAGE_BASE}/4.jpg`, description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', tip: 'Naikkan ritme dengan slot fokus tanpa distraksi.' };
  if (score <= 50) return { name: 'Badak Si Pemalas', imagePath: `${DEFAULT_IMAGE_BASE}/5.jpg`, description: 'Kuat sebenarnya, tapi susah mulai', tip: 'Jadwalkan task paling berat lebih awal.' };
  if (score <= 60) return { name: 'Bebek Mulai Jalan', imagePath: `${DEFAULT_IMAGE_BASE}/6.jpg`, description: 'Sudah mulai konsisten, walau masih goyang', tip: 'Jaga konsistensi dan tekan task skipped.' };
  if (score <= 70) return { name: 'Kelinci Si Rajin', imagePath: `${DEFAULT_IMAGE_BASE}/7.jpg`, description: 'Task mulai banyak selesai, ritme bagus', tip: 'Pertahankan ritme dan rapikan backlog pending.' };
  if (score <= 80) return { name: 'Semut Produktif', imagePath: `${DEFAULT_IMAGE_BASE}/8.jpg`, description: 'Rapi, konsisten, dan jarang skip', tip: 'Fokus pada task prioritas tinggi agar impact makin besar.' };
  if (score <= 90) return { name: 'Elang Fokus', imagePath: `${DEFAULT_IMAGE_BASE}/9.jpg`, description: 'Fokus tinggi, prioritas jelas', tip: 'Jaga kualitas eksekusi dan hindari overload.' };
  return { name: 'Naga Deadline', imagePath: `${DEFAULT_IMAGE_BASE}/10.jpg`, description: 'Mode legenda, task tunduk semua', tip: 'Pertahankan standar tinggi dan bantu backlog nol.' };
}

function resolveAttachmentPath(relativePath) {
  return path.resolve(projectRoot, relativePath);
}

function getAttachmentSize(relativePath) {
  const absolutePath = resolveAttachmentPath(relativePath);
  return fs.statSync(absolutePath).size;
}

function buildAttachmentBase64(relativePath) {
  const absolutePath = resolveAttachmentPath(relativePath);
  const fileBuffer = fs.readFileSync(absolutePath);
  return fileBuffer.toString('base64');
}

function buildSafeAttachmentBase64(relativePath) {
  const size = getAttachmentSize(relativePath);
  if (size > MAX_WHATSAPP_ATTACHMENT_BYTES) {
    return null;
  }

  return buildAttachmentBase64(relativePath);
}

function buildJakartaFormatter() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getRecentDayKeys(days) {
  const formatter = buildJakartaFormatter();
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - i);
    result.push(formatter.format(date));
  }

  return result;
}

function getUtcWindowForJakartaDay(dayKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) {
    throw new Error(`Invalid day key: ${dayKey}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return {
    startOfDayUtc: new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0)),
    endOfDayUtc: new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999)),
  };
}

async function resolveUser(connection, options) {
  const number = normalizeWhatsappNumber(options.number || DEFAULT_NUMBER);
  if (!number) {
    throw new Error('Target number is empty');
  }

  const params = [];
  const where = [];

  if (options.userId) {
    where.push('id = ?');
    params.push(options.userId);
  }

  where.push('whatsappNumber = ?');
  params.push(number);

  const [rows] = await connection.execute(
    `
      SELECT id, name, email, whatsappNumber, createdAt
      FROM User
      WHERE ${where.join(' AND ')}
      ORDER BY createdAt ASC
      LIMIT 1
    `,
    params,
  );

  return rows[0] || null;
}

async function getTaskStats(connection, userId) {
  const [rows] = await connection.execute(
    `
      SELECT status, COUNT(*) AS total
      FROM Task
      WHERE userId = ?
        AND deletedAt IS NULL
      GROUP BY status
    `,
    [userId],
  );

  const stats = { pending: 0, done: 0, skipped: 0 };
  for (const row of rows) {
    if (row.status === 'PENDING') stats.pending = Number(row.total || 0);
    if (row.status === 'DONE') stats.done = Number(row.total || 0);
    if (row.status === 'SKIPPED') stats.skipped = Number(row.total || 0);
  }

  return stats;
}

async function getDailyTaskStats(connection, userId, days = 7) {
  const dayKeys = getRecentDayKeys(days);
  const firstWindow = getUtcWindowForJakartaDay(dayKeys[0]);
  const lastWindow = getUtcWindowForJakartaDay(dayKeys[dayKeys.length - 1]);

  const [rows] = await connection.execute(
    `
      SELECT completedAt
      FROM Task
      WHERE userId = ?
        AND deletedAt IS NULL
        AND status = 'DONE'
        AND completedAt >= ?
        AND completedAt <= ?
      ORDER BY completedAt ASC
    `,
    [userId, firstWindow.startOfDayUtc, lastWindow.endOfDayUtc],
  );

  const formatter = buildJakartaFormatter();
  const bucket = Object.fromEntries(dayKeys.map((key) => [key, 0]));

  for (const row of rows) {
    if (!row.completedAt) continue;
    const key = formatter.format(new Date(row.completedAt));
    if (Object.prototype.hasOwnProperty.call(bucket, key)) {
      bucket[key] += 1;
    }
  }

  return dayKeys.map((date) => ({ date, count: bucket[date] || 0 }));
}

async function getOverviewAnalysis(connection, userId, stats, dailyData) {
  const total = stats.pending + stats.done + stats.skipped;
  const cachedRowQuery = await connection.execute(
    `
      SELECT score, insights, advice, totalTasks, completedTasks, pendingTasks, skippedTasks, expiresAt
      FROM OverviewAnalysisCache
      WHERE userId = ?
      LIMIT 1
    `,
    [userId],
  );
  const cached = cachedRowQuery[0][0] || null;
  const now = new Date();

  if (
    cached
    && cached.expiresAt
    && new Date(cached.expiresAt) > now
    && Number(cached.totalTasks || 0) === total
    && Number(cached.completedTasks || 0) === stats.done
    && Number(cached.pendingTasks || 0) === stats.pending
    && Number(cached.skippedTasks || 0) === stats.skipped
  ) {
    return {
      score: Number(cached.score || 50),
      insights: cached.insights ? JSON.parse(cached.insights) : [],
      advice: cached.advice ? JSON.parse(cached.advice) : [],
      source: 'cache',
    };
  }

  const apiUrl = process.env.NINE_ROUTER_API || '';
  const apiKey = process.env.NINE_ROUTER_API_KEY || '';
  const model = process.env.NINE_ROUTER_MODEL || 'cx/gpt-5.2';

  if (!apiUrl || !apiKey) {
    return {
      score: total > 0 ? Math.round((stats.done / total) * 100) : 0,
      insights: ['AI overview tidak tersedia karena 9Router belum dikonfigurasi.'],
      advice: [
        { title: 'Cek konfigurasi AI', description: 'Set NINE_ROUTER_API dan NINE_ROUTER_API_KEY untuk analisis otomatis.', type: 'warning' },
      ],
      source: 'fallback',
    };
  }

  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;
  const skipRate = total > 0 ? Math.round((stats.skipped / total) * 100) : 0;
  const recentDays = dailyData.slice(-7);
  const avgDailyCompletion = recentDays.length > 0
    ? Math.round(recentDays.reduce((sum, day) => sum + day.count, 0) / recentDays.length)
    : 0;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
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
    const body = await response.text().catch(() => '');
    throw new Error(`9Router request failed: ${response.status} ${body}`.trim());
  }

  const result = await response.json();
  const content = result && result.choices && result.choices[0] && result.choices[0].message
    ? result.choices[0].message.content
    : '';

  if (!content) {
    throw new Error('9Router response did not include message content');
  }

  const normalized = JSON.parse(String(content).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, ''));
  const analysis = {
    score: typeof normalized.score === 'number' ? Math.min(100, Math.max(0, normalized.score)) : 50,
    insights: Array.isArray(normalized.insights) ? normalized.insights.slice(0, 5) : [],
    advice: Array.isArray(normalized.advice)
      ? normalized.advice.slice(0, 3).map((item) => ({
          title: String((item && item.title) || 'Tip'),
          description: String((item && item.description) || ''),
          type: ['success', 'warning', 'info'].includes(item && item.type) ? item.type : 'info',
        }))
      : [],
    source: 'live-ai',
  };

  return analysis;
}

function buildOverviewMessage(user, stats, dailyData, analysis) {
  const total = stats.pending + stats.done + stats.skipped;
  const completionRate = total > 0 ? Math.round((stats.done / total) * 100) : 0;
  const skipRate = total > 0 ? Math.round((stats.skipped / total) * 100) : 0;
  const recentDays = dailyData.slice(-7);
  const activeDays = recentDays.filter((day) => day.count > 0).length;
  const bestDay = recentDays.reduce((best, day) => {
    if (!best || day.count > best.count) return day;
    return best;
  }, null);
  const score = analysis && typeof analysis.score === 'number' ? analysis.score : completionRate;
  const levelInfo = getLevelInfo(score);
  const level = Math.min(10, Math.max(1, Math.floor(score / 10) + 1));
  const progressToNextLevel = score >= 100 ? 10 : score % 10;
  const insight = analysis && Array.isArray(analysis.insights) && analysis.insights[0]
    ? analysis.insights[0]
    : 'Tetap konsisten menyelesaikan task prioritas tertinggi terlebih dahulu.';
  const secondInsight = analysis && Array.isArray(analysis.insights) && analysis.insights[1]
    ? analysis.insights[1]
    : null;
  const primaryAdvice = analysis && Array.isArray(analysis.advice) ? analysis.advice[0] : null;
  const secondaryAdvice = analysis && Array.isArray(analysis.advice) ? analysis.advice[1] : null;

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
    `📊 Overview Task${user.name ? ` — ${user.name}` : ''}`,
    '',
    `🏆 Level: ${levelInfo.name} (Level ${level})`,
    `🧠 Score: ${score}/100`,
    `🖼️ Arti gambar: ${levelInfo.name} = ${levelInfo.description}`,
    `📈 Selesai: ${completionRate}% | Skip: ${skipRate}%`,
    `📌 Total ${total} | Done ${stats.done} | Pending ${stats.pending} | Skipped ${stats.skipped}`,
    progressToNextLevel < 10 ? `⏫ Progress level berikutnya: ${progressToNextLevel}/10` : '👑 Level puncak tercapai.',
    '',
    `Highlight: ${healthHighlight}`,
    `Aktif 7 hari: ${activeDays}/7${bestDay && bestDay.count > 0 ? ` | Puncak: ${bestDay.count} task` : ''}`,
    '',
    'Makna level ini:',
    `- Nama hewan/gambar: ${levelInfo.name}`,
    `- Gambaran kondisi: ${levelInfo.description}`,
    `- Fokus perbaikan: ${levelInfo.tip}`,
    '',
    `Insight utama: ${insight}`,
    secondInsight ? `Insight tambahan: ${secondInsight}` : null,
    '',
    'Tindak lanjut detail:',
    primaryAdvice ? `1. ${primaryAdvice.title}` : '1. Selesaikan 1 task prioritas tertinggi hari ini.',
    secondaryAdvice ? `2. ${secondaryAdvice.title}` : `2. ${levelInfo.tip}`,
    `3. Jaga progres level supaya naik dari ${levelInfo.name} ke level berikutnya.`,
  ].filter(Boolean).join('\n');

  return {
    message,
    imagePath: levelInfo.imagePath,
    score,
    level: levelInfo.name,
  };
}

function splitWhatsappText(text, maxLength) {
  const normalized = String(text || '').trim();
  if (!normalized) return [];

  const chunks = [];
  let remaining = normalized;

  while (remaining.length > maxLength) {
    let splitIndex = remaining.lastIndexOf('\n', maxLength);
    if (splitIndex <= 0 || splitIndex < Math.floor(maxLength * 0.6)) {
      splitIndex = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitIndex <= 0 || splitIndex < Math.floor(maxLength * 0.6)) {
      splitIndex = maxLength;
    }

    const part = remaining.slice(0, splitIndex).trim();
    if (part) chunks.push(part);
    remaining = remaining.slice(splitIndex).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function buildOverviewBatches(message, hasLampiran) {
  const normalized = String(message || '').trim();
  if (!normalized) return [];

  if (!hasLampiran) {
    return splitWhatsappText(normalized, OVERVIEW_TEXT_BATCH_THRESHOLD).map((pesan) => ({
      pesan,
      hasLampiran: false,
    }));
  }

  if (normalized.length <= OVERVIEW_CAPTION_BATCH_THRESHOLD) {
    return [{ pesan: normalized, hasLampiran: true }];
  }

  const firstChunk = splitWhatsappText(normalized, OVERVIEW_CAPTION_BATCH_THRESHOLD)[0] || normalized.slice(0, OVERVIEW_CAPTION_BATCH_THRESHOLD).trim();
  const remaining = normalized.slice(firstChunk.length).trim();
  const overflowChunks = splitWhatsappText(remaining, OVERVIEW_TEXT_BATCH_THRESHOLD).map((pesan) => ({
    pesan,
    hasLampiran: false,
  }));

  return [
    { pesan: firstChunk, hasLampiran: true },
    ...overflowChunks,
  ];
}

async function sendWhatsappPayload(payload) {
  const token = getAuthToken();
  const baseUrl = process.env.WHATSAPP_BOT_URL || '';

  if (!baseUrl) {
    throw new Error('WHATSAPP_BOT_URL is not configured');
  }

  if (!token) {
    throw new Error('TOKEN_WHATSAPP / WHATSAPP_API_TOKEN / ADMIN_TOKEN is not configured');
  }

  const postPayload = async (bodyPayload) => {
    const response = await fetch(`${baseUrl}/api/whatsapp/send-personal`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const error = new Error(`WhatsApp gateway error: ${response.status} ${response.statusText}${body ? ` | ${body}` : ''}`);
      error.status = response.status;
      throw error;
    }
  };

  try {
    await postPayload(payload);
  } catch (error) {
    if (error && error.status === 413 && payload.lampiran) {
      await postPayload({ nomor: payload.nomor, pesan: payload.pesan });
      return { fallbackToTextOnly: true };
    }

    throw error;
  }

  return { fallbackToTextOnly: false };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const connection = await mysql.createConnection({
    ...getConfig(),
    connectTimeout: 8000,
  });

  try {
    const targetNumber = normalizeWhatsappNumber(options.number || DEFAULT_NUMBER);
    const user = await resolveUser(connection, { ...options, number: targetNumber });

    if (!user) {
      throw new Error(`User with whatsappNumber ${targetNumber}${options.userId ? ` and id ${options.userId}` : ''} not found`);
    }

    const stats = await getTaskStats(connection, user.id);
    const dailyData = await getDailyTaskStats(connection, user.id, 7);
    const analysis = await getOverviewAnalysis(connection, user.id, stats, dailyData);
    const overview = buildOverviewMessage(user, stats, dailyData, analysis);
    const attachmentSize = options.noImage ? 0 : getAttachmentSize(overview.imagePath);
    const lampiran = options.noImage ? '' : buildSafeAttachmentBase64(overview.imagePath);

    console.log('[WhatsApp Overview Manual Trigger] Start', {
      mode: options.send ? 'send' : 'dry-run',
      timezone: DEFAULT_TIMEZONE,
      userId: user.id,
      userName: user.name || null,
      number: targetNumber,
      score: overview.score,
      level: overview.level,
      analysisSource: analysis.source || 'unknown',
      hasLampiran: Boolean(lampiran),
      imagePath: options.noImage ? null : overview.imagePath,
      attachmentSize,
      attachmentSkipped: !options.noImage && !lampiran,
    });

    const batches = buildOverviewBatches(overview.message, Boolean(lampiran) && !options.noImage);

    console.log('--- OVERVIEW BATCH PREVIEW START ---');
    batches.forEach((batch, index) => {
      console.log(`[Batch ${index + 1}] hasLampiran=${batch.hasLampiran}`);
      console.log(batch.pesan);
    });
    console.log('--- OVERVIEW BATCH PREVIEW END ---');

    if (!options.send) {
      return;
    }

    let fallbackToTextOnly = false;
    for (const batch of batches) {
      const payload = batch.hasLampiran
        ? { nomor: targetNumber, pesan: batch.pesan, lampiran }
        : { nomor: targetNumber, pesan: batch.pesan };

      const sendResult = await sendWhatsappPayload(payload);
      if (batch.hasLampiran && sendResult && sendResult.fallbackToTextOnly) {
        fallbackToTextOnly = true;
      }
    }

    console.log('[WhatsApp Overview Manual Trigger] Sent', {
      userId: user.id,
      number: targetNumber,
      batchCount: batches.length,
      fallbackToTextOnly,
      score: overview.score,
      level: overview.level,
      hasLampiran: Boolean(lampiran) && !fallbackToTextOnly,
    });
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('[WhatsApp Overview Manual Trigger] Fatal', error && error.message ? error.message : error);
  process.exit(1);
});
