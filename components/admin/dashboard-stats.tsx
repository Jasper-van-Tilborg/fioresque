"use client";

import { useSyncExternalStore } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  totalOrders: number;
  totalRevenue: number;
  byStatus: { status: string; count: number }[];
  revenueLast7Days: { date: string; revenue: number }[];
};

export function DashboardStats({
  totalOrders,
  totalRevenue,
  byStatus,
  revenueLast7Days,
}: Props) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const revenueEur = (totalRevenue / 100).toFixed(2);
  const chartData = revenueLast7Days.map(({ date, revenue }) => ({
    date: new Date(date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }),
    revenue: revenue / 100,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <p className="text-sm text-[#302D2E]/70">Totaal orders</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-[#302D2E]">
            {totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <p className="text-sm text-[#302D2E]/70">Totale omzet</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-[#302D2E]">
            &euro; {revenueEur}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <h2 className="font-heading text-lg font-extrabold text-[#302D2E]">
            Omzet afgelopen 7 dagen
          </h2>
          <div className="mt-4 h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#302D2E/10" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v}`} />
                  <Tooltip formatter={(v) => [typeof v === "number" ? `€ ${v.toFixed(2)}` : v, "Omzet"]} />
                  <Bar dataKey="revenue" fill="#5E825F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse bg-[#302D2E]/5" />
            )}
          </div>
        </div>
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <h2 className="font-heading text-lg font-extrabold text-[#302D2E]">
            Orders per status
          </h2>
          <ul className="mt-4 space-y-2">
            {byStatus.map(({ status, count }) => (
              <li
                key={status}
                className="flex items-center justify-between rounded border border-[#302D2E]/10 px-3 py-2"
              >
                <span className="capitalize text-[#302D2E]">{status}</span>
                <span className="font-semibold text-[#302D2E]">{count}</span>
              </li>
            ))}
            {byStatus.length === 0 && (
              <li className="text-[#302D2E]/70">Geen orders</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
