import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { query } from '@/lib/db';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:support@edusmart.sn',
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, url } = await request.json();

    // Fetch all subscriptions for the students (demo: all subscriptions)
    const subscriptions = await query<any[]>('SELECT * FROM PushSubscription');

    const payload = JSON.stringify({ title, body, url });

    const sendPromises = subscriptions.map(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      return webpush.sendNotification(pushSubscription, payload).catch(err => {
        console.error('Error sending push:', err);
        // Clean up invalid subscriptions
        if (err.statusCode === 410) {
           query('DELETE FROM PushSubscription WHERE id = ?', [sub.id]);
        }
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Error sending push:', error);
    return NextResponse.json({ error: 'Failed to send push' }, { status: 500 });
  }
}
