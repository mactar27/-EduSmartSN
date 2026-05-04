import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const tenants = await query<any[]>('SELECT * FROM Tenant ORDER BY createdAt DESC');
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

    await query(
      'INSERT INTO Tenant (id, name, subdomain, primaryColor, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, "ACTIVE", NOW(), NOW())',
      [id, name, subdomain, primaryColor || '#1e40af']
    );

    return NextResponse.json({ message: 'Tenant created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
  }
}
