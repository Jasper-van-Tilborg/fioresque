"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Order = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export function OrdersTable({
  orders,
  statusFilter,
  searchQuery,
}: {
  orders: Order[];
  statusFilter: string;
  searchQuery: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("q");
    router.push(`/admin/orders?${next.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement)?.value?.trim() ?? "";
    const next = new URLSearchParams(searchParams.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    router.push(`/admin/orders?${next.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#302D2E]/10 bg-white p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            name="q"
            type="search"
            placeholder="Zoek op naam of e-mail"
            defaultValue={searchQuery}
            className="rounded border border-[#302D2E]/20 bg-[#FAF9F6] px-3 py-2 text-sm text-[#302D2E]"
          />
          <button
            type="submit"
            className="rounded bg-[#5E825F] px-4 py-2 text-sm font-medium text-white hover:bg-[#5E825F]/90"
          >
            Zoeken
          </button>
        </form>
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm text-[#302D2E]/80">Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="rounded border border-[#302D2E]/20 bg-[#FAF9F6] px-3 py-2 text-sm text-[#302D2E]"
          >
            <option value="">Alle</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="sent_to_printify">Sent to Printify</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#302D2E]/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#302D2E]/10 bg-[#FAF9F6] text-left">
              <th className="px-4 py-3 font-medium text-[#302D2E]">Order</th>
              <th className="px-4 py-3 font-medium text-[#302D2E]">Klant</th>
              <th className="px-4 py-3 font-medium text-[#302D2E]">E-mail</th>
              <th className="px-4 py-3 font-medium text-[#302D2E]">Totaal</th>
              <th className="px-4 py-3 font-medium text-[#302D2E]">Status</th>
              <th className="px-4 py-3 font-medium text-[#302D2E]">Datum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#302D2E]/5 hover:bg-[#FAF9F6]/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-[#5E825F] hover:underline"
                  >
                    #{o.id.slice(-8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[#302D2E]">
                  {o.firstName} {o.lastName}
                </td>
                <td className="px-4 py-3 text-[#302D2E]">{o.email}</td>
                <td className="px-4 py-3 text-[#302D2E]">
                  &euro; {(o.totalAmount / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-[#302D2E]/10 px-2 py-0.5 text-[#302D2E]">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#302D2E]/80">
                  {new Date(o.createdAt).toLocaleString("nl-NL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-8 text-center text-[#302D2E]/70">Geen orders gevonden</p>
        )}
      </div>
    </div>
  );
}
