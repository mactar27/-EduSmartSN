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
      const [columns]: any = await pool.query('DESCRIBE etablissements');
      await pool.end();
      const columnNames = columns.map((c: any) => c.Field || c.Champ || Object.values(c)[0]);
      return NextResponse.json({ status: "Structure etablissements", columnNames });
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
