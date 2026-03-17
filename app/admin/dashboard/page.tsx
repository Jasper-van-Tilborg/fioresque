import { getSupabase } from "@/lib/supabase";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";

export const metadata = {
  title: "Dashboard – Fioresque Admin",
};

export default async function AdminDashboardPage() {
  let totalOrders = 0;
  let totalRevenue = 0;
  let byStatus: { status: string; count: number }[] = [];
  let revenueLast7Days: { date: string; revenue: number }[] = [];
  let recentOrders: Array<{
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

    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });
    totalOrders = count ?? 0;

    const { data: revenueRows } = await supabase
      .from("orders")
      .select("totalAmount");
    totalRevenue = (revenueRows ?? []).reduce((s, r) => s + (r.totalAmount ?? 0), 0);

    const { data: ordersForStatus } = await supabase
      .from("orders")
      .select("status");
    const statusMap = new Map<string, number>();
    (ordersForStatus ?? []).forEach((o) => {
      const s = o.status ?? "unknown";
      statusMap.set(s, (statusMap.get(s) ?? 0) + 1);
    });
    byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const iso = sevenDaysAgo.toISOString();
    const { data: last7 } = await supabase
      .from("orders")
      .select("createdAt, totalAmount")
      .gte("createdAt", iso);
    const byDate = new Map<string, number>();
    for (let d = 0; d < 7; d++) {
      const dte = new Date();
      dte.setDate(dte.getDate() - (6 - d));
      byDate.set(dte.toISOString().slice(0, 10), 0);
    }
    (last7 ?? []).forEach((o) => {
      const date = (o.createdAt as string).slice(0, 10);
      if (byDate.has(date)) byDate.set(date, (byDate.get(date) ?? 0) + (o.totalAmount ?? 0));
    });
    revenueLast7Days = Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }));

    const { data: recent } = await supabase
      .from("orders")
      .select("id, firstName, lastName, email, totalAmount, status, createdAt")
      .order("createdAt", { ascending: false })
      .limit(5);
    recentOrders = (recent ?? []).map((o) => ({
      id: o.id,
      firstName: o.firstName ?? "",
      lastName: o.lastName ?? "",
      email: o.email ?? "",
      totalAmount: o.totalAmount ?? 0,
      status: o.status ?? "",
      createdAt: o.createdAt ?? "",
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : "Kon gegevens niet laden";
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-extrabold text-[#302D2E]">Dashboard</h1>
      {error ? (
        <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      ) : (
        <>
          <DashboardStats
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            byStatus={byStatus}
            revenueLast7Days={revenueLast7Days}
          />
          <RecentOrdersTable orders={recentOrders} />
        </>
      )}
    </div>
  );
}
