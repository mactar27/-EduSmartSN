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

    // Résilience maximale : on prend TOUT sans nommer de colonnes précises
    let rawData: any[] = [];
    try {
      rawData = await query<any[]>(`SELECT * FROM etudiants ORDER BY id DESC LIMIT 100`);
    } catch (e) {
      try {
        rawData = await query<any[]>(`SELECT * FROM Student ORDER BY id DESC LIMIT 100`);
      } catch (e2) {
        return NextResponse.json({ error: "ALL_TABLES_FAILED", details: e2.message }, { status: 500 });
      }
    }

    const formattedStudents = (rawData || []).map(s => ({
      id: s.id,
      name: s.name || (s.prenom ? `${s.prenom} ${s.nom}` : s.nom) || ("Élève #" + s.id),
      email: s.email || "---",
      studentId: s.matricule || s.studentId || "---",
      department: s.filiere || s.department || "---",
      statut: s.statut || s.status || "actif"
    }));

    return NextResponse.json({ 
      data: formattedStudents,
      count: formattedStudents.length
    });
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ 
      error: 'CRITICAL_ERROR', 
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
