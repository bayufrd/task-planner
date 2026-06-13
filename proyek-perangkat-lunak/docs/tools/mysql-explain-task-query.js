const mysql = require('mysql2/promise');

const rawUrl = process.env.DATABASE_URL || '';

function getConfig() {
  if (rawUrl) {
    const parsed = new URL(rawUrl);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ''),
    };
  }

  return {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3307),
    user: process.env.MYSQL_USER || 'taskplanner',
    password: process.env.MYSQL_PASSWORD || 'Taskplanner123!',
    database: process.env.MYSQL_DB || 'taskplanner',
  };
}

const explainSql = `
EXPLAIN
SELECT
  t.id,
  t.title,
  t.deadline,
  t.estimatedDuration,
  t.priority,
  t.skippedNotificationSent,
  u.name AS userName,
  u.whatsappNumber AS whatsappNumber
FROM Task t
LEFT JOIN User u ON u.id = t.userId
WHERE t.status = ?
  AND t.deletedAt IS NULL
  AND t.deadline <= ?
`;

async function main() {
  const config = getConfig();
  const deadline = process.argv[2] || '2026-06-12 23:59:59';

  console.log('Running EXPLAIN with config:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    deadline,
  });

  let connection;

  try {
    connection = await mysql.createConnection({
      ...config,
      connectTimeout: 8000,
    });

    const [rows] = await connection.execute(explainSql, ['PENDING', deadline]);
    console.table(rows);
  } catch (error) {
    console.error('EXPLAIN failed:', error && error.message ? error.message : error);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
