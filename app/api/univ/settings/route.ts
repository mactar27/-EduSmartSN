import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, logoUrl, primaryColor, secondaryColor, domain, subdomain } = body;

    // Build update data
    const updateData: any = {
      logoUrl,
      primaryColor,
      secondaryColor,
    };

    if (subdomain) updateData.subdomain = subdomain;
    if (domain !== undefined) updateData.domain = domain || null;

    await prisma.tenant.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: 'Configuration mise à jour' });
  } catch (error: any) {
    console.error('Error updating tenant settings:', error);
    // Handle unique constraint on domain
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce domaine est déjà utilisé par un autre établissement.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
