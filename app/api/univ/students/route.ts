import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // On essaie de récupérer un seul élève pour voir les colonnes
    const sample = await query<any[]>('SELECT * FROM etudiants LIMIT 1');
    
    if (sample.length > 0) {
      return NextResponse.json({ 
        error: 'DIAGNOSTIC_MODE',
        columnNames: Object.keys(sample[0])
      });
    } else {
      return NextResponse.json({ 
        error: 'TABLE_EMPTY',
        message: 'La table est vide, je ne peux pas voir les colonnes'
      });
    }
  } catch (error: any) {
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
