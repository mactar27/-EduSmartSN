import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cols: any = await query("DESCRIBE users");
    
    return NextResponse.json({ 
      status: "Structure complète", 
      columns: cols.map((c: any) => ({ name: c.Field, type: c.Type }))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "Erreur lors du seeding", 
      message: error.message 
    }, { status: 500 });
  }
}
