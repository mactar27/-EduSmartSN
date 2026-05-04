import { PrismaClient, UserRole, TenantStatus } from '@prisma/client';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'M@tzo2705',
  database: 'edusmart',
  connectionLimit: 1
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function migrate() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'M@tzo2705',
    database: 'edusmart',
  });

  console.log('--- Migrating Tenants ---');
  const [etablissements] = await connection.query('SELECT * FROM etablissements');
  for (const et of etablissements as any[]) {
    await prisma.tenant.upsert({
      where: { subdomain: et.slug },
      update: {
        name: et.name,
        status: et.is_active ? TenantStatus.ACTIVE : TenantStatus.SUSPENDED,
      },
      create: {
        id: et.id.toString(), // Keep ID for reference if possible, but schema says String/cuid
        name: et.name,
        subdomain: et.slug,
        status: et.is_active ? TenantStatus.ACTIVE : TenantStatus.SUSPENDED,
      },
    });
  }

  console.log('--- Migrating Users ---');
  const [users] = await connection.query('SELECT * FROM users');
  for (const u of users as any[]) {
    let role = UserRole.STUDENT;
    if (u.role === 'admin') role = UserRole.SUPER_ADMIN;
    else if (u.role === 'univ_admin') role = UserRole.UNIV_ADMIN;
    else if (u.role === 'professor') role = UserRole.PROFESSOR;

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: role,
        password: u.password_hash || u.password || 'pass123',
      },
      create: {
        id: u.id.toString(),
        email: u.email,
        name: u.name,
        role: role,
        password: u.password_hash || u.password || 'pass123',
      },
    });
  }

  console.log('--- Migrating Students ---');
  const [etudiants] = await connection.query('SELECT * FROM etudiants');
  for (const s of etudiants as any[]) {
    // Check if tenant exists (we used ID as string)
    const tenant = await prisma.tenant.findUnique({ where: { id: s.etablissement_id.toString() } });
    if (!tenant) continue;

    await prisma.student.upsert({
      where: { studentId: s.matricule },
      update: {
        department: s.filiere,
        tenantId: tenant.id,
      },
      create: {
        id: s.id.toString(),
        userId: s.user_id.toString(),
        studentId: s.matricule,
        name: s.nom ? `${s.prenom} ${s.nom}` : s.prenom,
        department: s.filiere,
        tenantId: tenant.id,
      },
    });
  }

  console.log('--- Migration Finished ---');
  await connection.end();
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
