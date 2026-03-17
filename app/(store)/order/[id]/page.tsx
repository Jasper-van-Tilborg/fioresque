import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
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
  let order: { id: string; totalAmount: number; email: string } | null = null;
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("orders")
      .select("id, totalAmount, email")
      .eq("id", id)
      .single();
    order = data;
  } catch {
    order = null;
  }

  if (!order) notFound();

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
