import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'M@tzo2705',
    database: 'edusmart',
  });

  const [tables] = await connection.query('SHOW TABLES');
  console.log('Tables in database:', tables);

  for (const table of tables as any[]) {
    const tableName = Object.values(table)[0] as string;
    const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
    console.log(`\nColumns in ${tableName}:`);
    console.table(columns);
  }

  await connection.end();
}

checkDB().catch(console.error);
