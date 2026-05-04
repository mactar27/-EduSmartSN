import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch latest demo requests
    const demoRequests = await query<any[]>(
      'SELECT id, etablissement_name as title, "Nouvelle demande de démo" as type, created_at FROM demandes_demo ORDER BY created_at DESC LIMIT 5'
    );

    // Fetch latest tenant registrations
    const newTenants = await query<any[]>(
      'SELECT id, name as title, "Nouvel établissement inscrit" as type, createdAt as created_at FROM Tenant ORDER BY createdAt DESC LIMIT 5'
    );

    // Combine and sort
    const notifications = [...demoRequests, ...newTenants]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
