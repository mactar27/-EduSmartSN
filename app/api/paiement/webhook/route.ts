import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);

    const paytechSecret = process.env.PAYTECH_API_SECRET || '';
    const { type_event, item_id, api_key_sha256, api_secret_sha256 } = data;

    if (api_key_sha256 !== crypto.createHash('sha256').update(process.env.PAYTECH_API_KEY || '').digest('hex')) {
       return NextResponse.json({ error: 'Invalid API Key Signature' }, { status: 401 });
    }

    if (type_event === 'sale_complete') {
      const transactionId = item_id;

      await prisma.payment.updateMany({
        where: { 
          transactionId, 
          status: 'PENDING' 
        },
        data: {
          status: 'PAID'
        }
      });

      console.log(`Paiement validé pour la transaction: ${transactionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('IPN Error:', error);
    return NextResponse.json({ error: 'IPN Processing Failed' }, { status: 500 });
  }
}
