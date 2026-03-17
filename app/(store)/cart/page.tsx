"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-primary">Winkelwagen</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="rounded-lg border border-primary/10 bg-secondary p-8 text-center">
              <p className="text-primary/80">Je winkelwagen is leeg.</p>
              <Link
                href="/shop"
                className="mt-4 inline-block font-medium text-accent hover:underline"
              >
                Naar shop
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-primary/10 rounded-lg border border-primary/10 bg-secondary p-4">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
