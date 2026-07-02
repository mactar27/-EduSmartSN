import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    // We'll link to an admin user since there's no auth session here in demo.
    // In real app, you fetch userId from session.
    const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!adminUser) return NextResponse.json({ error: 'No user to subscribe to' }, { status: 400 });

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh,
        auth
      },
      create: {
        userId: adminUser.id,
        endpoint,
        p256dh,
        auth
      }
    });

    return NextResponse.json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

