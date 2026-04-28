import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, studentId, description } = await request.json();

    // Configuration PayTech SN (Test mode par défaut)
    const API_KEY = process.env.PAYTECH_API_KEY || "votre_cle_test";
    const API_SECRET = process.env.PAYTECH_API_SECRET || "votre_secret_test";

    const payload = {
      item_name: description,
      item_price: amount,
      currency: "XOF",
      ref_command: `INS-${studentId}-${Date.now()}`,
      command_name: `Inscription ${studentId}`,
      env: "prod", 

      success_url: `http://localhost:3000/paiement/succes`,
      cancel_url: `http://localhost:3000/paiement/annuler`,
      custom_field: JSON.stringify({ studentId, amount })
    };

    const response = await fetch('https://paytech.sn/api/payment/request-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': API_KEY,
        'API_SECRET': API_SECRET
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success === 1) {
      return NextResponse.json({ redirect_url: data.redirect_url });
    } else {
      console.error('PayTech Error:', data);
      return NextResponse.json({ error: 'Erreur PayTech', details: data.errors }, { status: 400 });
    }
  } catch (error) {
    console.error('Paiement initialization error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
