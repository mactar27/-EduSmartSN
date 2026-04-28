import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);

    // 1. Sécurité : Vérification de la signature PayTech
    // PayTech envoie généralement un hash SHA256 du secret API + données
    const paytechSecret = process.env.PAYTECH_API_SECRET || '';
    
    // Note: Dans une intégration réelle, PayTech envoie une signature dans les headers 
    // ou via un champ spécifique. Ici on implémente la logique de validation sécurisée.
    
    const { type_event, item_id, api_key_sha256, api_secret_sha256 } = data;

    // Vérification de l'authenticité (Simple version for demo, use PayTech specific algo in prod)
    if (api_key_sha256 !== crypto.createHash('sha256').update(process.env.PAYTECH_API_KEY || '').digest('hex')) {
       return NextResponse.json({ error: 'Invalid API Key Signature' }, { status: 401 });
    }

    if (type_event === 'sale_complete') {
      const transactionId = item_id;

      // 2. Mise à jour sécurisée de la base de données
      await query(
        'UPDATE Payment SET status = "PAID", updatedAt = NOW() WHERE transactionId = ? AND status = "PENDING"',
        [transactionId]
      );

      console.log(`Paiement validé pour la transaction: ${transactionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('IPN Error:', error);
    return NextResponse.json({ error: 'IPN Processing Failed' }, { status: 500 });
  }
}
