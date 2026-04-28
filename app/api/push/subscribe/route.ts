import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    // For demo, we associate with a generic user or get from session
    // In real app, use auth() to get userId
    const userId = "demo-user-id"; 

    await query(
      'INSERT INTO PushSubscription (id, userId, endpoint, p256dh, auth, createdAt) VALUES (UUID(), ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE endpoint = VALUES(endpoint)',
      [userId, endpoint, p256dh, auth]
    );

    return NextResponse.json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
