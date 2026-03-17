import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { OrderDetailClient } from "@/components/admin/order-detail-client";

export const metadata = {
  title: "Order – Fioresque Admin",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: OrderRow | null = null;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) order = null;
    else order = data as OrderRow;
  } catch {
    order = null;
  }

  if (!order) notFound();

  const items = (order.items as OrderItemRow[]) ?? [];
  const printifyUrl = order.printifyOrderId
    ? `https://printify.com/app/orders/${order.printifyOrderId}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold text-[#302D2E]">
          Order #{order.id.slice(-8)}
        </h1>
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-[#5E825F] hover:underline"
        >
          ← Terug naar orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <h2 className="font-heading font-extrabold text-[#302D2E]">Klantgegevens</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div>
              <dt className="text-[#302D2E]/70">Naam</dt>
              <dd className="text-[#302D2E]">{order.firstName} {order.lastName}</dd>
            </div>
            <div>
              <dt className="text-[#302D2E]/70">E-mail</dt>
              <dd className="text-[#302D2E]">{order.email}</dd>
            </div>
            <div>
              <dt className="text-[#302D2E]/70">Adres</dt>
              <dd className="text-[#302D2E]">
                {order.address}, {order.postalCode} {order.city}, {order.country}
              </dd>
            </div>
            {order.phone && (
              <div>
                <dt className="text-[#302D2E]/70">Telefoon</dt>
                <dd className="text-[#302D2E]">{order.phone}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <h2 className="font-heading font-extrabold text-[#302D2E]">Betaling & Printify</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div>
              <dt className="text-[#302D2E]/70">Stripe session ID</dt>
              <dd className="font-mono text-[#302D2E]">{order.stripeSessionId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[#302D2E]/70">Printify order ID</dt>
              <dd className="text-[#302D2E]">
                {order.printifyOrderId ?? "—"}
                {printifyUrl && (
                  <a
                    href={printifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-[#5E825F] hover:underline"
                  >
                    Open in Printify →
                  </a>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[#302D2E]/70">Totaal</dt>
              <dd className="text-[#302D2E]">&euro; {(order.totalAmount / 100).toFixed(2)}</dd>
            </div>
          </dl>
          <OrderDetailClient orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
        <h2 className="font-heading font-extrabold text-[#302D2E]">Bestelde producten</h2>
        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between rounded border border-[#302D2E]/10 px-3 py-2 text-sm"
            >
              <span className="text-[#302D2E]">
                Printify product {item.printifyProductId} · variant {item.variantId} · qty {item.quantity}
              </span>
              <span className="text-[#302D2E]">&euro; {((item.price * item.quantity) / 100).toFixed(2)}</span>
            </li>
          ))}
          {items.length === 0 && <li className="text-[#302D2E]/70">Geen items</li>}
        </ul>
      </div>
    </div>
  );
}

type OrderRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string | null;
  totalAmount: number;
  status: string;
  stripeSessionId: string | null;
  printifyOrderId: string | null;
  items: unknown;
};

type OrderItemRow = {
  printifyProductId: string;
  variantId: number;
  quantity: number;
  price: number;
};
