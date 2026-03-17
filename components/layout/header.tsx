"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const count = useCartStore((s) => s.getCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-secondary/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-extrabold tracking-tight text-primary"
        >
          Fioresque
        </Link>
        <nav className="flex items-center gap-6" aria-label="Hoofdnavigatie">
          <Link
            href="/shop"
            className="text-sm font-medium text-primary/80 transition hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href="/over-ons"
            className="text-sm font-medium text-primary/80 transition hover:text-primary"
          >
            Over ons
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-sm font-medium text-primary/80 transition hover:text-primary"
            aria-label={mounted && count > 0 ? `Winkelwagen, ${count} items` : "Winkelwagen"}
          >
            <span aria-hidden>Winkelwagen</span>
            {mounted && count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-secondary">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
