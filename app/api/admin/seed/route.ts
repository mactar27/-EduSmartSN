import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log("Remote seeding tenants...");
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
    
    return NextResponse.json({ message: "Production Database (Tenants + Admin) Seeded Successfully!" });
  } catch (error) {
    console.error("Remote seed error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Seed failed" }, { status: 500 });
  }
}
