import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
    multipleStatements: true,
  });

  console.log('Connected to TiDB Serverless');

  const scriptsDir = path.join(__dirname);
  const sqlFiles = fs.readdirSync(scriptsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of sqlFiles) {
    console.log(`Running ${file}...`);
    const sql = fs.readFileSync(path.join(scriptsDir, file), 'utf-8');
    
    try {
      await connection.query(sql);
      console.log(`${file} completed successfully`);
    } catch (error) {
      console.error(`Error in ${file}:`, error);
      throw error;
    }
  }

  await connection.end();
  console.log('Migration completed!');
}

runMigration().catch(console.error);
