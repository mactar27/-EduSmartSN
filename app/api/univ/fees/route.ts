import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all fees for the current tenant
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) return NextResponse.json({ error: 'Tenant non identifié' }, { status: 400 });

    const fees = await query<any[]>('SELECT * FROM Fee WHERE tenantId = ? ORDER BY createdAt DESC', [tenantId]);

    return NextResponse.json({ fees });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST a new fee
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) return NextResponse.json({ error: 'Tenant non identifié' }, { status: 400 });

    const { name, amount, category, recurrence } = await request.json();
    const id = crypto.randomUUID();

    await query(
      'INSERT INTO Fee (id, name, amount, category, recurrence, tenantId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, name, parseFloat(amount), category, recurrence, tenantId]
    );

    return NextResponse.json({ fee: { id, name, amount, category, recurrence } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 });
  }
}

// DELETE a fee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!id || !tenantId) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });

    await query('DELETE FROM Fee WHERE id = ? AND tenantId = ?', [id, tenantId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
