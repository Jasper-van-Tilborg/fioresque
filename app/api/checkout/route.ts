import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { PaymentMethod, getMollieClient } from "@/lib/mollie";
import { apiErrorResponse } from "@/lib/errors";
import { AppError } from "@/lib/errors";

type CheckoutItem = {
  productId: string;
  printifyProductId: string;
  variantId: number;
  quantity: number;
  price: number;
};

type Body = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  items: CheckoutItem[];
};

function validateBody(body: unknown): body is Body {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.email === "string" &&
    b.email.length > 0 &&
    typeof b.firstName === "string" &&
    b.firstName.length > 0 &&
    typeof b.lastName === "string" &&
    b.lastName.length > 0 &&
    typeof b.address === "string" &&
    b.address.length > 0 &&
    typeof b.city === "string" &&
    b.city.length > 0 &&
    typeof b.postalCode === "string" &&
    b.postalCode.length > 0 &&
    typeof b.country === "string" &&
    b.country.length > 0 &&
    Array.isArray(b.items) &&
    (b.items as unknown[]).every(
      (i) =>
        i &&
        typeof i === "object" &&
        "productId" in i &&
        "printifyProductId" in i &&
        "variantId" in i &&
        "quantity" in i &&
        "price" in i
    )
  );
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    if (!validateBody(raw)) {
      throw new AppError("Ongeldige gegevens.", 400);
    }

    const totalAmount = raw.items.reduce(
      (sum: number, i: CheckoutItem) => sum + i.price * i.quantity,
      0
    );
    if (totalAmount <= 0) {
      throw new AppError("Geen items of totaal is nul.", 400);
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();
    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        email: raw.email,
        firstName: raw.firstName,
        lastName: raw.lastName,
        address: raw.address,
        city: raw.city,
        postalCode: raw.postalCode,
        country: raw.country,
        phone: raw.phone ?? null,
        items: raw.items,
        totalAmount,
        status: "pending",
        molliePaymentId: null,
        printifyOrderId: null,
        updatedAt: now,
      })
      .select("id")
      .single();

    if (insertError || !order) {
      throw new AppError(insertError?.message ?? "Kon order niet aanmaken.", 500);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const mollie = getMollieClient();
    const payment = await mollie.payments.create({
      amount: {
        value: (totalAmount / 100).toFixed(2),
        currency: "EUR",
      },
      description: `Bestelling #${order.id.slice(-8)} – Fioresque Artwear`,
      redirectUrl: `${baseUrl}/order/${order.id}`,
      webhookUrl: `${baseUrl}/api/webhooks/mollie`,
      metadata: { orderId: order.id },
      method: PaymentMethod.ideal,
    });

    await supabase
      .from("orders")
      .update({ molliePaymentId: payment.id, updatedAt: new Date().toISOString() })
      .eq("id", order.id);

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      throw new AppError("Mollie gaf geen checkout-URL terug.", 500);
    }

    return Response.json({ checkoutUrl, orderId: order.id });
  } catch (error) {
    return apiErrorResponse(error, 500);
  }
}
