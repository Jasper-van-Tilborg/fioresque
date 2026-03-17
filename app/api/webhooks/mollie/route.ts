import { NextRequest } from "next/server";
import { getMollieClient } from "@/lib/mollie";
import { getSupabase } from "@/lib/supabase";
import { submitPrintifyOrder } from "@/lib/printify-orders";
import { sendOrderConfirmation } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = typeof body?.id === "string" ? body.id : null;
    if (!paymentId) {
      return Response.json({ error: "Missing payment id" }, { status: 400 });
    }

    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);

    if (payment.status !== "paid") {
      return Response.json({ received: true });
    }

    const supabase = getSupabase();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("molliePaymentId", paymentId)
      .single();

    if (orderError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return Response.json({ received: true });
    }

    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      await supabase
        .from("orders")
        .update({ status: "failed", updatedAt: new Date().toISOString() })
        .eq("id", order.id);
      return Response.json({ error: "PRINTIFY_SHOP_ID not set" }, { status: 500 });
    }

    const items = order.items as Array<{
      printifyProductId: string;
      variantId: number;
      quantity: number;
    }>;

    try {
      const printifyOrder = await submitPrintifyOrder(
        shopId,
        order.id,
        items,
        {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          phone: order.phone,
          country: order.country,
          address: order.address,
          city: order.city,
          postalCode: order.postalCode,
        }
      );

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
      return Response.json(
        { error: "Printify submit failed" },
        { status: 500 }
      );
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

    return Response.json({ received: true });
  } catch (error) {
    console.error("Mollie webhook error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
