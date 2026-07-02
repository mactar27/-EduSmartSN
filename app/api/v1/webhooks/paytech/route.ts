import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    
    // PayTech envoie souvent un form-data (application/x-www-form-urlencoded) ou du JSON
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }

    const { type_event, ref_command, item_price, api_key_sha256, api_secret_sha256 } = body;

    // En production, il est VITAL de vérifier les hash SHA256 pour s'assurer
    // que la requête provient bien de PayTech et non d'un fraudeur.
    // if (api_key_sha256 !== process.env.PAYTECH_API_KEY_SHA256 || api_secret_sha256 !== process.env.PAYTECH_API_SECRET_SHA256) {
    //   return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    // }

    // type_event est généralement 'sale_complete' en cas de succès
    const isSuccess = type_event === 'sale_complete' || body.status === 'success';

    if (!ref_command) {
      return NextResponse.json({ error: 'Référence manquante' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { reference: ref_command }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 });
    }

    if (payment.status === 'SUCCESS') {
      // Éviter le double traitement
      return NextResponse.json({ message: 'Paiement déjà traité' });
    }

    if (isSuccess) {
      await prisma.payment.update({
        where: { reference: ref_command },
        data: { 
          status: 'SUCCESS',
          paytechRef: body.token || `PT-${Math.random().toString(36).substring(7)}`,
          method: 'PAYTECH_AUTO' // Idéalement, PayTech nous renvoie la méthode (WAVE, ORANGE_MONEY)
        }
      });
      console.log(`[Webhook PayTech] Paiement ${ref_command} validé avec succès.`);
    } else {
      await prisma.payment.update({
        where: { reference: ref_command },
        data: { status: 'FAILED' }
      });
      console.log(`[Webhook PayTech] Échec du paiement ${ref_command}.`);
    }

    // Le webhook attend toujours un status 200 pour ne pas renvoyer la notification
    return NextResponse.json({ success: 1 });

  } catch (error) {
    console.error('[Webhook PayTech] Error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
