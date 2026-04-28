import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [cols]: any = await query("SHOW COLUMNS FROM users LIKE 'role'");
    
    return NextResponse.json({ 
      status: "Détails colonne role", 
      type: cols[0].Type
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Erreur lors du seeding", 
      message: error.message 
    }, { status: 500 });
  }
}
