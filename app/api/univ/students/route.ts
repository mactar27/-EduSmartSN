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
      let tenants: any[] = [];
      try {
        // Essai sur la table Prisma de production
        tenants = await query<any[]>('SELECT id FROM Tenant WHERE status = "ACTIVE" ORDER BY id ASC LIMIT 1');
      } catch (e) {
        // Repli sur la table locale
        try {
          tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 ORDER BY id ASC LIMIT 1');
        } catch (e2) {
          console.warn("No Tenant or etablissements table found.");
        }
      }
      
      if (tenants && tenants.length > 0) {
        targetTenantId = tenants[0].id;
      }
    }

    // Requête avec jointure pour récupérer le nom depuis la table users
    const subjectCode = searchParams.get('subjectId') || 'INF1011';

    // Résilience maximale : on prend TOUT sans nommer de colonnes précises
    let rawData: any[] = [];
    let diagnosticLog = "";
    try {
      rawData = await query<any[]>(`SELECT * FROM etudiants ORDER BY id DESC LIMIT 100`);
      diagnosticLog += "Query etudiants success. ";
    } catch (e: any) {
      diagnosticLog += "Query etudiants FAILED: " + e.message + " | ";
      try {
        rawData = await query<any[]>(`SELECT * FROM Student ORDER BY id DESC LIMIT 100`);
        diagnosticLog += "Query Student success. ";
      } catch (e2: any) {
        diagnosticLog += "Query Student FAILED: " + e2.message;
        // RETOURNER 200 AVEC L'ERREUR POUR POUVOIR LA LIRE
        return NextResponse.json({ 
          error: "ALL_TABLES_FAILED", 
          details: diagnosticLog,
          data: [],
          count: 0
        });
      }
    }

    const formattedStudents = (rawData || []).map(s => ({
      id: s.id || s._id || Math.random(),
      name: s.name || (s.prenom ? `${s.prenom} ${s.nom}` : s.nom) || ("Élève #" + s.id),
      email: s.email || "---",
      studentId: s.matricule || s.studentId || "---",
      department: s.filiere || s.department || "---",
      statut: s.statut || s.status || "actif"
    }));

    return NextResponse.json({ 
      data: formattedStudents,
      count: formattedStudents.length,
      debug: diagnosticLog
    });
  } catch (error: any) {
    console.error("Fetch Error:", error);
    // RETOURNER 200 AVEC L'ERREUR POUR POUVOIR LA LIRE
    return NextResponse.json({ 
      error: 'CRITICAL_ERROR', 
      message: error.message,
      data: [],
      count: 0
    });
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
