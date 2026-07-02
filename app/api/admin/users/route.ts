import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenant: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      ...user,
      tenant_name: user.tenant?.name || null
    }));

    return NextResponse.json({ data: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
