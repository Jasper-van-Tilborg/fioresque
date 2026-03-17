import { getSupabase } from "@/lib/supabase";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata = {
  title: "Orders – Fioresque Admin",
};

type SearchParams = { status?: string; q?: string };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const query = params.q ?? "";

  let orders: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }> = [];
  let error: string | null = null;

  try {
    const supabase = getSupabase();
    let q = supabase
      .from("orders")
      .select("id, firstName, lastName, email, totalAmount, status, createdAt")
      .order("createdAt", { ascending: false });

    if (statusFilter) {
      q = q.eq("status", statusFilter);
    }
    if (query.trim()) {
      q = q.or(
        `firstName.ilike.%${query}%,lastName.ilike.%${query}%,email.ilike.%${query}%`
      );
    }

    const { data } = await q;
    orders = (data ?? []).map((o) => ({
      id: o.id,
      firstName: o.firstName ?? "",
      lastName: o.lastName ?? "",
      email: o.email ?? "",
      totalAmount: o.totalAmount ?? 0,
      status: o.status ?? "",
      createdAt: o.createdAt ?? "",
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : "Kon orders niet laden";
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-extrabold text-[#302D2E]">Orders</h1>
      {error ? (
        <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      ) : (
        <OrdersTable
          orders={orders}
          statusFilter={statusFilter}
          searchQuery={query}
        />
      )}
    </div>
  );
}
