import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, code, credits, coefficient, ueId } = await request.json();

    if (!name || !code || !ueId) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        credits: parseInt(credits) || 0,
        coefficient: parseFloat(coefficient) || 1.0,
        ueId
      }
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating Subject:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la matière', details: error.message }, { status: 500 });
  }
}
