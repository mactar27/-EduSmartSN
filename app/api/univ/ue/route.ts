import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, code, departmentId } = await request.json();

    if (!name || !code || !departmentId) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const ue = await prisma.unitOfTeaching.create({
      data: {
        name,
        code,
        departmentId
      }
    });

    return NextResponse.json(ue, { status: 201 });
  } catch (error: any) {
    console.error('Error creating UE:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de l\'UE', details: error.message }, { status: 500 });
  }
}
