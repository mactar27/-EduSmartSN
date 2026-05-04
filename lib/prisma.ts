import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';
import { URL } from 'url';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPoolConfig = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.substring(1),
      connectionLimit: 5
    };
  }
  return {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'M@tzo2705',
    database: 'edusmart',
    connectionLimit: 5
  };
};

const pool = mariadb.createPool(getPoolConfig());
// @ts-expect-error - PrismaMariaDb expects a different Pool interface version, but it works at runtime
const adapter = new PrismaMariaDb(pool as any);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
