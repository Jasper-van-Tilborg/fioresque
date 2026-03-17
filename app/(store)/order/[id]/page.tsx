import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfill-order";
import { Button } from "@/components/ui/button";
import { ClearCartOnSuccess } from "@/components/order/clear-cart-on-success";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const supabase = getSupabase();
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("id", id)
      .single();
    if (!order) return { title: "Order" };
    return {
      title: `Order #${order.id.slice(-8)} – Fioresque Artwear`,
    };
  } catch {
    return { title: "Order" };
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, totalAmount, email, status, stripeSessionId, firstName, lastName, address, city, postalCode, country, phone, items")
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  // If order is still pending and we have a Stripe session, verify payment and fulfill
  if (order.status === "pending" && order.stripeSessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      if (session.payment_status === "paid") {
        await fulfillOrder({
          id: order.id,
          email: order.email,
          firstName: order.firstName,
          lastName: order.lastName,
          address: order.address,
          city: order.city,
          postalCode: order.postalCode,
          country: order.country,
          phone: order.phone,
          items: order.items,
          totalAmount: order.totalAmount,
        });
      }
    } catch (err) {
      console.error("Order fulfillment on success page failed:", err);
    }
  }

  const shortId = order.id.slice(-8);
  const totalEur = (order.totalAmount / 100).toFixed(2);

  return (
    <>
      <ClearCartOnSuccess />
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-extrabold text-primary">
          Bedankt voor je bestelling
        </h1>
        <p className="mt-4 text-primary/80">
          We hebben je betaling ontvangen. Je bestelling <strong>#{shortId}</strong> is in behandeling.
        </p>
        <p className="mt-2 text-primary/70">
          Totaalbedrag: &euro; {totalEur}
        </p>
        <p className="mt-6 text-sm text-primary/70">
          Je ontvangt een bevestigingsmail op <strong>{order.email}</strong>. Zodra je bestelling is verzonden, krijg je een e-mail met track & trace.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/shop">
            <Button variant="outline">Verder winkelen</Button>
          </Link>
          <Link href="/">
            <Button>Naar homepage</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
