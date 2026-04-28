import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendDemoNotification } from '@/lib/mail';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const demandes = await query<any[]>(
      `SELECT * FROM demandes_demo ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );
    
    const countResult = await query<any[]>('SELECT COUNT(*) as total FROM demandes_demo');

    return NextResponse.json({
      data: demandes,
      total: countResult[0]?.total || 0,
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

    await query(
      'INSERT INTO demandes_demo (etablissement_name, contact_name, email, phone, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [etablissement_name, contact_name, email, phone, message]
    );

    // Envoyer la notification par email (si configuré)
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
