"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const total = useCartStore((s) => s.getTotal());
  const count = useCartStore((s) => s.getCount());
  const totalEur = (total / 100).toFixed(2);

  if (count === 0) {
    return (
      <div className="rounded-lg border border-primary/10 bg-secondary p-6 text-center">
        <p className="text-primary/80">Je winkelwagen is leeg.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 font-medium text-secondary hover:bg-accent/90"
        >
          Naar shop
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-secondary p-6">
      <div className="flex justify-between text-lg">
        <span className="text-primary/80">Totaal</span>
        <span className="font-semibold text-primary">&euro; {totalEur}</span>
      </div>
      <p className="mt-1 text-sm text-primary/60">Excl. eventuele verzendkosten</p>
      <Link
        href="/checkout"
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-lg font-medium text-secondary hover:bg-accent/90"
      >
        Naar checkout
      </Link>
    </div>
  );
}
