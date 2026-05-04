import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const { name, subdomain, primaryColor, status } = body;

    await query(
      'UPDATE Tenant SET name = ?, subdomain = ?, primaryColor = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      [name, subdomain, primaryColor, status, id]
    );

    return NextResponse.json({ message: 'Tenant updated successfully' });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    await query('DELETE FROM Tenant WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 500 });
  }
}
