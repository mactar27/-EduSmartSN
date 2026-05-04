import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log("Remote initializing and seeding...");

    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS Tenant (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        subdomain VARCHAR(191) UNIQUE NOT NULL,
        primaryColor VARCHAR(191) DEFAULT '#1e40af',
        status VARCHAR(191) DEFAULT 'ACTIVE',
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS User (
        id VARCHAR(191) PRIMARY KEY,
        email VARCHAR(191) UNIQUE NOT NULL,
        password VARCHAR(191) NOT NULL,
        name VARCHAR(191),
        role VARCHAR(191) DEFAULT 'STUDENT',
        tenantId VARCHAR(191),
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS demandes_demo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        etablissement_name VARCHAR(191) NOT NULL,
        contact_name VARCHAR(191) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(191) NOT NULL,
        message TEXT,
        statut VARCHAR(191) DEFAULT 'nouveau',
        created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);

    const tenants = [
      { id: 'uam', name: 'Université Amadou Mahtar Mbow', subdomain: 'uam', primaryColor: '#1e40af' },
      { id: 'espoir-bs', name: 'Espoir Business School', subdomain: 'espoir-bs', primaryColor: '#059669' },
      { id: 'ucad', name: 'Université Cheikh Anta Diop', subdomain: 'ucad', primaryColor: '#b91c1c' }
    ];

    for (const t of tenants) {
      await query(
        'INSERT IGNORE INTO Tenant (id, name, subdomain, primaryColor, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, "ACTIVE", NOW(), NOW())',
        [t.id, t.name, t.subdomain, t.primaryColor]
      );
    }

    // Add a default SuperAdmin if not exists
    await query(
      'INSERT IGNORE INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['admin-id', 'admin@edusmart.sn', 'admin123', 'Admin Global', 'SUPER_ADMIN']
    );
    
    return NextResponse.json({ message: "Production Database (Tables + Data) Initialized Successfully!" });
  } catch (error) {
    console.error("Remote seed error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Seed failed" }, { status: 500 });
  }
}
