import mysql from 'mysql2/promise';

const globalForMysql = globalThis as unknown as {
  mysql: mysql.Pool | undefined;
};

const poolConfig = process.env.DATABASE_URL 
  ? { uri: process.env.DATABASE_URL }
  : {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'M@tzo2705',
      database: 'edusmart',
    };

export const db = globalForMysql.mysql ?? (
  process.env.DATABASE_URL 
    ? mysql.createPool(process.env.DATABASE_URL)
    : mysql.createPool(poolConfig as any)
);

if (process.env.NODE_ENV !== 'production') {
  globalForMysql.mysql = db;
}

export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  try {
    const [rows] = await db.query(sql, params);

    return rows as T;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}

export default db;
