import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendDemoNotification } from '@/lib/mail';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const demandes = await query<any[]>(
      `SELECT * FROM DemoRequest ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`
    );
    
    const countResult = await query<any[]>('SELECT COUNT(*) as total FROM DemoRequest');

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
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await query(
      'INSERT INTO DemoRequest (id, etablissementName, contactName, email, phone, message, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, etablissement_name, contact_name, email, phone, message]
    );

    // Envoyer la notification par email
    await sendDemoNotification({ etablissement_name, contact_name, email, phone, message });

    return NextResponse.json({ 
      message: 'Demo request submitted successfully',
      id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating demo request:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request' },
      { status: 500 }
    );
  }
}
