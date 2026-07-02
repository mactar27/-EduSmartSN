import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const tenantId = searchParams.get('tenantId'); // Optionnel, mais sécuritaire

    if (!departmentId) {
      return NextResponse.json({ error: 'departmentId est requis' }, { status: 400 });
    }

    const events = await prisma.scheduleEvent.findMany({
      where: {
        departmentId,
        ...(tenantId ? { tenantId } : {})
      },
      include: {
        professor: {
          include: {
            user: true
          }
        },
        department: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json({ data: events });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du planning' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, type, room, professorId, departmentId, tenantId, dayOfWeek, startTime, endTime } = body;

    if (!subject || !room || !departmentId || !tenantId || dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
    }

    const newEvent = await prisma.scheduleEvent.create({
      data: {
        subject,
        type: type || 'CM',
        room,
        professorId,
        departmentId,
        tenantId,
        dayOfWeek,
        startTime,
        endTime
      },
      include: {
        professor: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json({ data: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule event:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du cours' }, { status: 500 });
  }
}
