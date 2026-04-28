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
      const [studentCols]: any = await pool.query('DESCRIBE etudiants');
      const [paymentCols]: any = await pool.query('DESCRIBE paiements');
      await pool.end();
      
      return NextResponse.json({ 
        status: "Structure tables", 
        etudiants: studentCols.map((c: any) => c.Field || c.Champ || Object.values(c)[0]),
        paiements: paymentCols.map((c: any) => c.Field || c.Champ || Object.values(c)[0])
      });
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
