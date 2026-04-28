import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return NextResponse.json({ error: "DATABASE_URL manquante" });

    const pool = mysql.createPool({
      uri: url,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      const [tenants]: any = await pool.query('SELECT id FROM etablissements LIMIT 1');
      const results: any = { status: "Test Stats", tenants };

      if (tenants.length > 0) {
        const id = tenants[0].id;
        const [students]: any = await pool.query('SELECT COUNT(*) as count FROM etudiants WHERE etablissement_id = ?', [id]);
        const [payments]: any = await pool.query('SELECT SUM(montant) as total FROM paiements WHERE etablissement_id = ?', [id]);
        results.students = students;
        results.payments = payments;
      }

      await pool.end();
      return NextResponse.json(results);
    } catch (sqlError: any) {
      await pool.end();
      return NextResponse.json({ status: "Erreur", message: sqlError.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Échec du Pool", 
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
