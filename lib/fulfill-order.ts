import { getSupabase } from "@/lib/supabase";
import { submitPrintifyOrder } from "@/lib/printify-orders";
import { sendOrderConfirmation } from "@/lib/resend";

export type OrderForFulfillment = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string | null;
  items: unknown;
  totalAmount: number;
};

/**
 * Submit order to Printify, update order status, and send confirmation email.
 * Idempotent: only run when order.status is "pending".
 */
export async function fulfillOrder(order: OrderForFulfillment): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();

  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) {
    await supabase
      .from("orders")
      .update({ status: "failed", updatedAt: new Date().toISOString() })
      .eq("id", order.id);
    return { ok: false, error: "PRINTIFY_SHOP_ID not set" };
  }

  const items = order.items as Array<{
    printifyProductId: string;
    variantId: number;
    quantity: number;
  }>;

  try {
    const printifyOrder = await submitPrintifyOrder(shopId, order.id, items, {
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      country: order.country,
      address: order.address,
      city: order.city,
      postalCode: order.postalCode,
    });

    await supabase
      .from("orders")
      .update({
        status: "sent_to_printify",
        printifyOrderId: printifyOrder.id,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", order.id);
  } catch (printifyError) {
    console.error("Printify order submit failed:", printifyError);
    await supabase
      .from("orders")
      .update({ status: "failed", updatedAt: new Date().toISOString() })
      .eq("id", order.id);
    return { ok: false, error: "Printify submit failed" };
  }

  try {
    await sendOrderConfirmation({
      orderId: order.id.slice(-8),
      email: order.email,
      firstName: order.firstName,
      totalAmountCents: order.totalAmount,
    });
  } catch (emailError) {
    console.error("Resend email failed:", emailError);
  }

  return { ok: true };
}
