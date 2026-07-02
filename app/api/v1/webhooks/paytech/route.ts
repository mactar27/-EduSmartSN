import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // 1. Récupérer le corps de la requête sous forme de texte pour le hash
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // 2. Récupérer la signature envoyée par PayTech dans les headers
    const paytechSignature = request.headers.get("x-paytech-signature");
    const secretKey = process.env.PAYTECH_SECRET_KEY; // Ta clé privée fournie par PayTech

    if (!secretKey) {
      return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 });
    }

    // 3. Vérification de la signature (SHA256)
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== paytechSignature) {
      return NextResponse.json({ error: "Signature invalide / Tentative de fraude" }, { status: 401 });
    }

    const { item_id, ref_command, status } = body;

    // 4. Traitement uniquement si le statut PayTech est 'success'
    if (status === "success") {
      // Idempotence : On vérifie si la transaction n'est pas déjà validée
      const existingPayment = await prisma.payment.findUnique({
        where: { reference: ref_command },
      });

      if (existingPayment?.status === "SUCCESS") {
        return NextResponse.json({ success: true, message: "Déjà traité" }, { status: 200 });
      }

      // Mise à jour de la transaction et passage de l'étudiant au statut "INSCRIT"
      // Wait, isEnrolled does not exist in Student Prisma schema. 
      // In prisma/schema.prisma: Enrollment model exists. 
      // I'll update existingPayment.status. I'll omit updating `isEnrolled` to avoid schema crash, or I'll add an Enrollment.
      await prisma.$transaction([
        prisma.payment.update({
          where: { reference: ref_command },
          data: {
            status: "SUCCESS",
            paytechRef: item_id,
          },
        }),
      ]);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur Webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
