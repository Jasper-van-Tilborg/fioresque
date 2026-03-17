import Link from "next/link";

type Order = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
      <h2 className="font-heading text-lg font-extrabold text-[#302D2E]">
        Meest recente orders
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#302D2E]/10 text-left">
              <th className="pb-2 font-medium text-[#302D2E]">Order</th>
              <th className="pb-2 font-medium text-[#302D2E]">Klant</th>
              <th className="pb-2 font-medium text-[#302D2E]">Totaal</th>
              <th className="pb-2 font-medium text-[#302D2E]">Status</th>
              <th className="pb-2 font-medium text-[#302D2E]">Datum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#302D2E]/5">
                <td className="py-2">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-[#5E825F] hover:underline"
                  >
                    #{o.id.slice(-8)}
                  </Link>
                </td>
                <td className="py-2 text-[#302D2E]">
                  {o.firstName} {o.lastName}
                </td>
                <td className="py-2 text-[#302D2E]">
                  &euro; {(o.totalAmount / 100).toFixed(2)}
                </td>
                <td className="py-2">
                  <span className="rounded bg-[#302D2E]/10 px-2 py-0.5 text-[#302D2E]">
                    {o.status}
                  </span>
                </td>
                <td className="py-2 text-[#302D2E]/80">
                  {new Date(o.createdAt).toLocaleDateString("nl-NL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-6 text-center text-[#302D2E]/70">Geen orders</p>
        )}
      </div>
      <div className="mt-4">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-[#5E825F] hover:underline"
        >
          Alle orders →
        </Link>
      </div>
    </div>
  );
}
