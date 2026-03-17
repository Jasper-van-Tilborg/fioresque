import { NextRequest } from "next/server";

/**
 * Stripe webhook endpoint – stub for now.
 * Order fulfillment runs on the success page via Stripe session ID.
 * To enable webhooks later: verify signature with STRIPE_WEBHOOK_SECRET,
 * handle checkout.session.completed, and call fulfillOrder() from lib/fulfill-order.
 */
export async function POST(_request: NextRequest) {
  return Response.json({ received: true });
}
