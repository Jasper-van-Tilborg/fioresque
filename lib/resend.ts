import { Resend } from "resend";

export function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export type OrderConfirmationData = {
  orderId: string;
  email: string;
  firstName: string;
  totalAmountCents: number;
};

const FROM_EMAIL = "Fioresque Artwear <noreply@fioresque.nl>";
const FROM_EMAIL_FALLBACK = "onboarding@resend.dev";

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL ?? FROM_EMAIL_FALLBACK;
  const totalEur = (data.totalAmountCents / 100).toFixed(2);

  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: `Orderbevestiging #${data.orderId} – Fioresque Artwear`,
    html: `
      <h1>Bedankt voor je bestelling</h1>
      <p>Beste ${data.firstName},</p>
      <p>We hebben je bestelling <strong>#${data.orderId}</strong> ontvangen.</p>
      <p>Totaalbedrag: &euro; ${totalEur}</p>
      <p>Je ontvangt een e-mail zodra je bestelling is verzonden.</p>
      <p>Met vriendelijke groet,<br>Het team van Fioresque Artwear</p>
    `,
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}
