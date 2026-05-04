import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * API Route: Students Management
 * Version: 2.1.0 - Full SQL Join Implementation
 * This comment is here to trigger a fresh Vercel build.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    let targetTenantId = tenantId;
    if (!targetTenantId) {
      const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 ORDER BY id ASC LIMIT 1');
      if (!tenants || tenants.length === 0) {
        console.warn("No active establishment found for student fetch");
        return NextResponse.json({ data: [], count: 0, warning: "NO_ACTIVE_TENANT" });
      }
      targetTenantId = tenants[0].id;
    }

    // Requête avec jointure pour récupérer le nom depuis la table users
    const subjectCode = searchParams.get('subjectId') || 'INF1011';

    const students = await query<any[]>(`
      SELECT 
        e.id, 
        COALESCE(u.name, 'Élève Importé') as name, 
        u.email, 
        e.matricule as studentId, 
        e.filiere as department, 
        e.statut
      FROM etudiants e
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.id DESC
    `);

    return NextResponse.json({ 
      data: students || [],
      count: students?.length || 0
    });
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ 
      error: 'SQL_ERROR', 
      message: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, studentId, department, photoUrl } = body;

    const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 ORDER BY id ASC LIMIT 1');
    const tenantId = tenants[0].id;

    // Séparer le nom complet
    const nameParts = name.split(' ');
    const prenom = nameParts.slice(0, -1).join(' ') || 'Prénom';
    const nom = nameParts.slice(-1)[0] || name;

    const result = await query<any>(
      'INSERT INTO etudiants (prenom, nom, email, matricule, filiere, photo_url, etablissement_id, statut, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, "actif", NOW(), NOW())',
      [prenom, nom, `${studentId.toLowerCase()}@wockytech.xyz`, studentId, department, photoUrl, tenantId]
    );

    return NextResponse.json({ message: 'Élève créé avec succès', id: result.insertId }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student', details: error.message }, { status: 500 });
  }
}
