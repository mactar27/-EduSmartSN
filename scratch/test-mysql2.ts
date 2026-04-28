import mysql from 'mysql2/promise';

async function test() {
  const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'M@tzo2705',
    database: 'edusmart',
  });

  try {
    const [rows] = await db.execute('SHOW TABLES');
    console.log('Mysql2 Connected! Tables:', rows);
  } catch (err) {
    console.error('Mysql2 Connection failed:', err);
  } finally {
    await db.end();
  }
}

test();
