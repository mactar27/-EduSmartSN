import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, logoUrl, primaryColor, secondaryColor } = body;

    await prisma.tenant.update({
      where: { id },
      data: {
        logoUrl,
        primaryColor,
        secondaryColor
      }
    });

    return NextResponse.json({ message: 'Configuration mise à jour' });
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

