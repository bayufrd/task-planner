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

const DAILY_DISCIPLINE_QUOTES = [
  'Disiplin waktu adalah bentuk sederhana dari menghargai masa depan sendiri.',
  'Waktu yang diatur dengan disiplin akan berubah menjadi hasil yang konsisten.',
  'Jadwal yang dijaga hari ini akan membentuk pencapaian esok hari.',
  'Konsistensi kecil setiap hari lebih kuat daripada niat besar yang tertunda.',
];

const DAILY_REMINDER_KIND = 'daily-schedule';
const DEFAULT_IMAGE_PATH = 'public/harian-candidate-600.jpg';
const DEFAULT_TIMEZONE = 'Asia/Jakarta';
const DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD = 750;
const DAILY_SCHEDULE_TEXT_BATCH_THRESHOLD = 1500;

function printHelp() {
  console.log(`Manual trigger Daily Schedule Reminder
Reads env automatically from:
  1. proyek-perangkat-lunak/.env
  2. proyek-perangkat-lunak/.env.local
  3. proyek-perangkat-lunak/backend/.env
Later file overrides earlier file.

Usage:
  node docs/tools/manual-trigger-daily-schedule-reminder.js [options]

Options:
  --send                 Actually send WhatsApp messages. Default: dry-run only.
  --date=YYYY-MM-DD      Use custom Jakarta date. Default: today in Asia/Jakarta.
  --user-id=<id>         Only process 1 specific user.
  --number=<number>      Only process matching whatsappNumber.
  --limit=<n>            Limit candidate users.
  --allow-sent           Ignore sent dedup check in Reminder table.
  --mark-sent            Upsert sent log to Reminder table after successful send.
  --no-image             Send text only without lampiran.
  --image=<path>         Override image path relative to proyek-perangkat-lunak.
  --dry-run              Force dry-run mode.
  --help                 Show this help.

Env used:
  DATABASE_URL
  WHATSAPP_BOT_URL
  TOKEN_WHATSAPP
  WHATSAPP_API_TOKEN
  ADMIN_TOKEN
`);
}

function parseArgs(argv) {
  const options = {
    send: false,
    date: '',
    userId: '',
    number: '',
    limit: 0,
    allowSent: false,
    markSent: false,
    noImage: false,
    imagePath: DEFAULT_IMAGE_PATH,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--send') options.send = true;
    else if (arg === '--dry-run') options.send = false;
    else if (arg === '--allow-sent') options.allowSent = true;
    else if (arg === '--mark-sent') options.markSent = true;
    else if (arg === '--no-image') options.noImage = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--date=')) options.date = arg.slice('--date='.length);
    else if (arg.startsWith('--user-id=')) options.userId = arg.slice('--user-id='.length);
    else if (arg.startsWith('--number=')) options.number = normalizeWhatsappNumber(arg.slice('--number='.length));
    else if (arg.startsWith('--limit=')) options.limit = Number(arg.slice('--limit='.length)) || 0;
    else if (arg.startsWith('--image=')) options.imagePath = arg.slice('--image='.length) || DEFAULT_IMAGE_PATH;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function normalizeWhatsappNumber(input) {
  return String(input || '').replace(/[^\d]/g, '').trim();
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

function getJakartaDayKey(referenceDate = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(referenceDate);
}

function parseDayKey(dayKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) {
    throw new Error(`Invalid --date value: ${dayKey}. Use YYYY-MM-DD.`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function getUtcWindowForJakartaDay(dayKey) {
  const { year, month, day } = parseDayKey(dayKey);
  return {
    startOfDayUtc: new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0)),
    endOfDayUtc: new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999)),
    day,
  };
}

function formatDateLabel(dayKey) {
  const { startOfDayUtc } = getUtcWindowForJakartaDay(dayKey);
  return startOfDayUtc.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: DEFAULT_TIMEZONE,
  });
}

function formatTimeLabel(deadline) {
  return new Date(deadline).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: DEFAULT_TIMEZONE,
  });
}

function buildCaption(user, tasks, dayKey) {
  const dateLabel = formatDateLabel(dayKey);
  const quoteIndex = parseDayKey(dayKey).day % DAILY_DISCIPLINE_QUOTES.length;
  const quote = DAILY_DISCIPLINE_QUOTES[quoteIndex];
  const userName = user.name ? `, ${user.name}` : '';

  if (tasks.length > 0) {
    const taskLines = tasks.map((task, index) => [
      `${index + 1}. ${task.title}`,
      `   - Jam: ${formatTimeLabel(task.deadline)} WIB`,
      `   - Status: ${task.status}`,
    ].join('\n'));

    return [
      `Selamat pagi${userName}! Ini jadwal Anda untuk hari ini, ${dateLabel}.`,
      '',
      'Jadwal hari ini:',
      ...taskLines,
      '',
      'Tetap fokus dan kerjakan sesuai urutan prioritas.',
      '',
      `"${quote}"`,
    ].join('\n');
  }

  return [
    `Selamat pagi${userName}! Hari ini belum ada jadwal yang tercatat.`,
    '',
    'Yuk buat task baru agar hari Anda tetap terarah.',
    '',
    'Panduan singkat:',
    '- daftar akun WA: user_id daftar',
    '- lihat bantuan: task bantuan',
    '- contoh tambah task: task tambah meeting besok jam 10 malam #urgent',
    '- lihat task aktif: task lihat jadwal',
    '- lihat task besok: task lihat jadwal besok',
    '- overview: task overview',
    '',
    `"${quote}"`,
  ].join('\n');
}

function splitLongText(text, maxLength) {
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

function buildReminderBatches(caption) {
  const normalized = String(caption || '').trim();
  if (!normalized) return [];

  if (normalized.length <= DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD) {
    return [{ pesan: normalized, hasLampiran: true }];
  }

  const firstChunk = splitLongText(normalized, DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD)[0] || normalized.slice(0, DAILY_SCHEDULE_CAPTION_BATCH_THRESHOLD).trim();
  const remaining = normalized.slice(firstChunk.length).trim();
  const overflowChunks = splitLongText(remaining, DAILY_SCHEDULE_TEXT_BATCH_THRESHOLD).map((pesan) => ({
    pesan,
    hasLampiran: false,
  }));

  return [
    { pesan: firstChunk, hasLampiran: true },
    ...overflowChunks,
  ];
}

function buildAttachmentBase64(relativePath) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const fileBuffer = fs.readFileSync(absolutePath);
  return fileBuffer.toString('base64');
}

async function getUsers(connection, options) {
  const where = ['whatsappNumber IS NOT NULL', "TRIM(whatsappNumber) <> ''"];
  const params = [];

  if (options.userId) {
    where.push('id = ?');
    params.push(options.userId);
  }

  if (options.number) {
    where.push('whatsappNumber = ?');
    params.push(options.number);
  }

  let sql = `
    SELECT id, name, whatsappNumber, createdAt
    FROM User
    WHERE ${where.join(' AND ')}
    ORDER BY createdAt ASC
  `;

  if (options.limit > 0) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }

  const [rows] = await connection.execute(sql, params);
  return rows;
}

async function getTasksForUser(connection, userId, startOfDayUtc, endOfDayUtc) {
  const [rows] = await connection.execute(
    `
      SELECT title, deadline, status
      FROM Task
      WHERE userId = ?
        AND deletedAt IS NULL
        AND deadline >= ?
        AND deadline <= ?
      ORDER BY deadline ASC
    `,
    [userId, startOfDayUtc, endOfDayUtc],
  );

  return rows;
}

async function hasSentReminder(connection, reminderId) {
  const [rows] = await connection.execute(
    `
      SELECT id
      FROM Reminder
      WHERE id = ?
        AND taskId IS NULL
        AND sent = true
      LIMIT 1
    `,
    [reminderId],
  );

  return rows.length > 0;
}

async function markReminderSent(connection, reminderId, userId, sentAt) {
  await connection.execute(
    `
      INSERT INTO Reminder (id, userId, taskId, remindAt, sent, sentAt, createdAt)
      VALUES (?, ?, NULL, ?, true, ?, NOW())
      ON DUPLICATE KEY UPDATE
        sent = VALUES(sent),
        sentAt = VALUES(sentAt),
        remindAt = VALUES(remindAt)
    `,
    [reminderId, userId, sentAt, sentAt],
  );
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

  const response = await fetch(`${baseUrl}/api/whatsapp/send-personal`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`WhatsApp gateway error: ${response.status} ${response.statusText}${body ? ` | ${body}` : ''}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const dayKey = options.date || getJakartaDayKey();
  const { startOfDayUtc, endOfDayUtc } = getUtcWindowForJakartaDay(dayKey);
  const reminderKey = `${DAILY_REMINDER_KIND}:${dayKey}`;
  const imagePath = options.imagePath || DEFAULT_IMAGE_PATH;
  const attachmentBase64 = options.noImage ? '' : buildAttachmentBase64(imagePath);

  const connection = await mysql.createConnection({
    ...getConfig(),
    connectTimeout: 8000,
  });

  try {
    const users = await getUsers(connection, options);

    console.log('[Daily Schedule Manual Trigger] Start', {
      mode: options.send ? 'send' : 'dry-run',
      dayKey,
      timezone: DEFAULT_TIMEZONE,
      startOfDayUtc: startOfDayUtc.toISOString(),
      endOfDayUtc: endOfDayUtc.toISOString(),
      userFilter: options.userId || null,
      numberFilter: options.number || null,
      limit: options.limit || null,
      allowSent: options.allowSent,
      markSent: options.markSent,
      imagePath: options.noImage ? null : imagePath,
      users: users.length,
    });

    let processed = 0;
    let skippedAlreadySent = 0;
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const nomor = normalizeWhatsappNumber(user.whatsappNumber);
      if (!nomor) {
        continue;
      }

      const reminderId = `${reminderKey}:${user.id}`;
      if (!options.allowSent) {
        const alreadySent = await hasSentReminder(connection, reminderId);
        if (alreadySent) {
          skippedAlreadySent += 1;
          console.log('[Daily Schedule Manual Trigger] Skip already sent', {
            reminderId,
            userId: user.id,
            nomor,
          });
          continue;
        }
      }

      const tasks = await getTasksForUser(connection, user.id, startOfDayUtc, endOfDayUtc);
      const pesan = buildCaption(user, tasks, dayKey);
      const batches = options.noImage
        ? splitLongText(pesan, DAILY_SCHEDULE_TEXT_BATCH_THRESHOLD).map((item) => ({ pesan: item, hasLampiran: false }))
        : buildReminderBatches(pesan);
      processed += 1;

      console.log('[Daily Schedule Manual Trigger] Candidate', {
        reminderId,
        userId: user.id,
        nomor,
        taskCount: tasks.length,
        batchCount: batches.length,
        hasLampiran: batches.some((batch) => batch.hasLampiran),
      });

      if (!options.send) {
        console.log('--- BATCH PREVIEW START ---');
        batches.forEach((batch, index) => {
          console.log(`[Batch ${index + 1}] hasLampiran=${batch.hasLampiran}`);
          console.log(batch.pesan);
        });
        console.log('--- BATCH PREVIEW END ---');
        continue;
      }

      try {
        for (const [index, batch] of batches.entries()) {
          try {
            const payload = batch.hasLampiran
              ? { nomor, pesan: batch.pesan, lampiran: attachmentBase64 }
              : { nomor, pesan: batch.pesan };

            await sendWhatsappPayload(payload);
          } catch (error) {
            const message = error && error.message ? error.message : String(error);
            if (batch.hasLampiran && message.includes('413')) {
              await sendWhatsappPayload({ nomor, pesan: batch.pesan });
              continue;
            }
            throw new Error(`batch-${index + 1}: ${message}`);
          }
        }

        if (options.markSent) {
          await markReminderSent(connection, reminderId, user.id, new Date());
        }

        sent += 1;
        console.log('[Daily Schedule Manual Trigger] Sent', {
          reminderId,
          userId: user.id,
          nomor,
          markSent: options.markSent,
          batchCount: batches.length,
          hasLampiran: batches.some((batch) => batch.hasLampiran),
        });
      } catch (error) {
        failed += 1;
        console.error('[Daily Schedule Manual Trigger] Failed', {
          reminderId,
          userId: user.id,
          nomor,
          batchCount: batches.length,
          error: error && error.message ? error.message : error,
        });
      }
    }

    console.log('[Daily Schedule Manual Trigger] Done', {
      mode: options.send ? 'send' : 'dry-run',
      dayKey,
      processed,
      skippedAlreadySent,
      sent,
      failed,
    });
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('[Daily Schedule Manual Trigger] Fatal', error && error.message ? error.message : error);
  process.exit(1);
});
