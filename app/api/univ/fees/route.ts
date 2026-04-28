import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all fees for the current tenant
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) return NextResponse.json({ error: 'Tenant non identifié' }, { status: 400 });

    const fees = await prisma.fee.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });

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

    const fee = await prisma.fee.create({
      data: {
        name,
        amount: parseFloat(amount),
        category,
        recurrence,
        tenantId
      }
    });

    return NextResponse.json({ fee });
  } catch (error) {
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

    await prisma.fee.delete({
      where: { id, tenantId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
  }
}
