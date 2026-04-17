// Simple MySQL connection test using mysql2/promise
// Usage:
// 1) npm init -y
// 2) npm install mysql2
// 3) node tools/test-mysql-connection.js

const mysql = require('mysql2/promise');

// Change these or set environment variables
const host = process.env.MYSQL_HOST || '192.168.1.2';
const port = process.env.MYSQL_PORT || 3307;
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '0202';
const database = process.env.MYSQL_DB || '';

(async () => {
  console.log('Testing MySQL connection to %s:%s as %s', host, port, user);
  let conn;
  try {
    conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      connectTimeout: 5000
    });

    console.log('Connected. Server version:', (await conn.query('SELECT VERSION() as v'))[0][0].v);

    const [rows] = await conn.query('SHOW DATABASES');
    console.log('Databases:');
    rows.forEach(r => console.log(' -', r.Database));

    // Extra diagnostics: show what MySQL thinks our current user@host is and the effective grants
    const [cuRows] = await conn.query("SELECT CURRENT_USER() as cu");
    const currentUser = cuRows[0] && cuRows[0].cu ? cuRows[0].cu : '<unknown>';
    console.log('CURRENT_USER reported by server:', currentUser);

    try {
      const parts = currentUser.split('@');
      if (parts.length === 2) {
        const userPart = parts[0].replace(/'/g, "\\'");
        const hostPart = parts[1].replace(/'/g, "\\'");
        const [grants] = await conn.query(`SHOW GRANTS FOR '${userPart}'@'${hostPart}'`);
        console.log('Grants for', currentUser + ':');
        grants.forEach(g => console.log(' -', Object.values(g)[0]));
      } else {
        console.log('Could not parse CURRENT_USER for grants lookup:', currentUser);
      }
    } catch (e) {
      console.error('Failed to fetch grants:', e && e.message ? e.message : e);
    }

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Connection or query failed:');
    console.error(err && err.message ? err.message : err);
    if (conn) try { await conn.end(); } catch (e) {}
    process.exit(1);
  }
})();
