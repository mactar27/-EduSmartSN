import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDemoNotification } from '@/lib/mail';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In Prisma schema, there is no status field on DemoRequest, so we just fetch all
    const [demandes, total] = await Promise.all([
      prisma.demoRequest.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.demoRequest.count()
    ]);

    const formattedDemandes = demandes.map(d => ({
      ...d,
      etablissement_name: d.etablissementName,
      contact_name: d.contactName,
      created_at: d.createdAt
    }));

    return NextResponse.json({
      data: formattedDemandes,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { etablissement_name, contact_name, email, phone, message } = body;

    if (!etablissement_name || !contact_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existingRequest = await prisma.demoRequest.findFirst({
      where: {
        email,
        createdAt: { gt: thirtyDaysAgo }
      }
    });
    
    if (existingRequest) {
      return NextResponse.json(
        { error: 'Une demande a déjà été faite pour cet établissement ces 30 derniers jours. Veuillez patienter ou nous contacter directement.' },
        { status: 429 }
      );
    }
    
    await prisma.demoRequest.create({
      data: {
        etablissementName: etablissement_name,
        contactName: contact_name,
        email,
        phone,
        message
      }
    });

    try {
      await sendDemoNotification({ etablissement_name, contact_name, email, phone, message });
    } catch (e) {
      console.warn("Mail notification failed but DB save succeeded");
    }

    return NextResponse.json({ 
      message: 'Demande soumise avec succès !'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating demo request:', error);
    return NextResponse.json(
      { error: 'Échec de la soumission' },
      { status: 500 }
    );
  }
}

