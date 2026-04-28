import { Resend } from 'resend';

// Use a placeholder if the key is missing (prevents build-time crashes on Vercel)
const apiKey = process.env.RESEND_API_KEY || 're_placeholder_for_build';
export const resend = new Resend(apiKey);

export async function sendDemoNotification(data: {
  etablissement_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message?: string;
}) {
  try {
    await resend.emails.send({
      from: 'EduSmart SN <onboarding@resend.dev>',
      to: 'ndiayeamadoumactar3@gmail.com',
      subject: `Nouvelle demande de démo : ${data.etablissement_name}`,
      html: `
        <h2>Nouvelle demande de démo reçue</h2>
        <p><strong>Établissement :</strong> ${data.etablissement_name}</p>
        <p><strong>Contact :</strong> ${data.contact_name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
        <p><strong>Message :</strong> ${data.message || 'Aucun message'}</p>
      `,
    });
    console.log('Email de notification envoyé.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}
