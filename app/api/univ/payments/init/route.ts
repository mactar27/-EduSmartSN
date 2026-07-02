import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, amount, tenantId: bodyTenantId } = body;

    if (!studentId || !amount) {
      return NextResponse.json({ error: 'studentId et amount sont obligatoires' }, { status: 400 });
    }

    let tenantId = bodyTenantId;
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' }
      });
      if (!tenant) return NextResponse.json({ error: 'Aucun tenant actif trouvé' }, { status: 404 });
      tenantId = tenant.id;
    }

    // Générer une référence unique interne pour cette commande
    const internalReference = `PAY-UAM-${uuidv4().substring(0, 8).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        reference: internalReference,
        status: 'PENDING',
        studentId,
        tenantId
      }
    });

    // En production, nous appellerions ici l'API de PayTech pour récupérer l'URL de redirection.
    // Const payload = {
    //   item_name: "Mensualité Avril",
    //   item_price: amount,
    //   command_name: internalReference,
    //   ref_command: internalReference,
    //   env: "test",
    //   success_url: "https://edusmartsn.vercel.app/univ/recouvrement?status=success",
    //   ipn_url: "https://edusmartsn.vercel.app/api/v1/webhooks/paytech"
    // };
    
    // Mock de l'URL PayTech pour le MVP
    const mockPaytechUrl = `/univ/recouvrement?simulate_paytech=true&ref=${internalReference}&amount=${amount}`;

    return NextResponse.json({ 
      data: payment,
      redirectUrl: mockPaytechUrl,
      message: 'Paiement initialisé'
    }, { status: 201 });

  } catch (error) {
    console.error('Error initializing payment:', error);
    return NextResponse.json(
      { error: 'Échec de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
