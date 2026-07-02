import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const demoRequests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const newTenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const mappedDemoRequests = demoRequests.map(d => ({
      id: d.id,
      title: d.etablissementName,
      type: 'Nouvelle demande de démo',
      created_at: d.createdAt.toISOString()
    }));

    const mappedTenants = newTenants.map(t => ({
      id: t.id,
      title: t.name,
      type: 'Nouvel établissement inscrit',
      created_at: t.createdAt.toISOString()
    }));

    const notifications = [...mappedDemoRequests, ...mappedTenants]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

