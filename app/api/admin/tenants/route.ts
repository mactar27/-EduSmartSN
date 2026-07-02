import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ data: tenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, subdomain, primaryColor } = body;

    if (!id || !name || !subdomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.tenant.create({
      data: {
        id,
        name,
        subdomain,
        primaryColor: primaryColor || '#1e40af',
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ message: 'Tenant created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}
