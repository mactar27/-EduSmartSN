import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return NextResponse.json({ error: "DATABASE_URL manquante" });

    const connection = await mysql.createConnection({
      uri: url,
      ssl: { rejectUnauthorized: false }
    });
    
    await connection.ping();
    await connection.end();

    return NextResponse.json({ status: "Connecté avec succès à TiDB Cloud !" });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Échec de connexion", 
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
