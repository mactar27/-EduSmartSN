import { createPool } from 'mariadb';

async function test() {
  const pool = createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'M@tzo2705',
    database: 'edusmart',
    connectionLimit: 1
  });

  try {
    const conn = await pool.getConnection();
    console.log('Successfully connected to MariaDB/MySQL!');
    const rows = await conn.query('SELECT 1 as result');
    console.log('Query result:', rows);
    conn.release();
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
