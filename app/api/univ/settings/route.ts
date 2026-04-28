import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, logoUrl, primaryColor, secondaryColor } = body;

    await query(
      'UPDATE Tenant SET logoUrl = ?, primaryColor = ?, secondaryColor = ?, updatedAt = NOW() WHERE id = ?',
      [logoUrl, primaryColor, secondaryColor, id]
    );

    return NextResponse.json({ message: 'Configuration mise à jour' });
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
