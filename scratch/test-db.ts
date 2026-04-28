import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
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

  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.demoRequest.count();
    console.log('Successfully connected! Demo requests count:', count);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
