import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json();
    console.log(`Starting import of ${students?.length} students`);
    
    // On récupère l'établissement actif
    const tenants = await query<any[]>('SELECT id FROM etablissements WHERE is_active = 1 ORDER BY id ASC LIMIT 1');
    if (!tenants || tenants.length === 0) {
      return NextResponse.json({ error: 'Aucun établissement actif trouvé' }, { status: 404 });
    }
    const tenantId = tenants[0].id;
    console.log(`Targeting tenant ID: ${tenantId}`);

    let successCount = 0;
    for (const student of students) {
      try {
        const matricule = student.studentId || `SN-${Math.random().toString(36).slice(-5).toUpperCase()}`;
        const email = student.email || `${matricule.toLowerCase()}@edusmart.sn`;

        // 1. Créer l'utilisateur d'abord
        const userResult = await query<any>(
          `INSERT INTO users (name, email, role, password, created_at, updated_at) 
           VALUES (?, ?, 'student', 'pass123', NOW(), NOW())`,
          [student.name, email]
        );

        const userId = userResult.insertId;

        // 2. Créer le profil élève lié
        await query(
          `INSERT INTO etudiants (user_id, matricule, filiere, etablissement_id, statut, created_at, updated_at) 
           VALUES (?, ?, ?, ?, 'actif', NOW(), NOW())`,
          [userId, matricule, student.department || 'Général', tenantId]
        );
        
        successCount++;
      } catch (err) {
        console.error(`Failed to insert student ${student.name}:`, err);
      }
    }

    console.log(`Import finished: ${successCount} successes`);
    return NextResponse.json({ 
      message: `${successCount} élèves importés avec succès`,
      count: successCount 
    });
  } catch (error: any) {
    console.error('Critical Import error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'importation', details: error.message }, { status: 500 });
  }
}
