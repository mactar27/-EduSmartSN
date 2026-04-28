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
    
    const [rows] = await pool.query('SELECT 1 as test');
    await pool.end();

    return NextResponse.json({ status: "Pool connecté avec succès !", data: rows });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Échec du Pool", 
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
