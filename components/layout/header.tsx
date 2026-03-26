"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";

function HeaderIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full text-secondary/90 transition hover:bg-secondary/10 hover:text-secondary md:size-9"
    >
      {children}
    </span>
  );
}

export function Header() {
  const count = useCartStore((s) => s.getCount());
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-secondary bg-primary/95 backdrop-blur">
      <div className="mx-auto hidden h-[78px] max-w-6xl items-center justify-between px-4 sm:px-6 md:flex">
        <nav className="flex items-center gap-9" aria-label="Hoofdnavigatie">
          <Link
            href="/shop"
            className="font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary"
          >
            SHOP
          </Link>
          <Link
            href="/shop"
            className="font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary"
          >
            COLLECTIONS
          </Link>
          <Link
            href="/over-ons"
            className="font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary"
          >
            ABOUT US
          </Link>
        </nav>

        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-label="Ga naar home">
          <Image
            src="https://www.figma.com/api/mcp/asset/84355b1b-5d5d-40b1-971e-65212ce06220"
            alt="Fioresque logo"
            width={90}
            height={58}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-3" aria-label="Gebruikersacties">
          <Link href="#" aria-label="Zoeken">
            <HeaderIcon label="Zoeken">
              <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </HeaderIcon>
          </Link>
          <Link href="#" aria-label="Favorieten">
            <HeaderIcon label="Favorieten">
              <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 20-1.2-1.1C6 14.6 3 11.8 3 8.3A4.3 4.3 0 0 1 7.3 4C9 4 10.7 4.8 12 6.1 13.3 4.8 15 4 16.7 4A4.3 4.3 0 0 1 21 8.3c0 3.5-3 6.3-7.8 10.6z" />
              </svg>
            </HeaderIcon>
          </Link>
          <Link href="#" aria-label="Profiel">
            <HeaderIcon label="Profiel">
              <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </HeaderIcon>
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center"
            aria-label={mounted && count > 0 ? `Winkelwagen, ${count} items` : "Winkelwagen"}
          >
            <HeaderIcon label="Winkelwagen">
              <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 7h12l-1.5 11h-9z" />
                <path d="M9 7V6a3 3 0 0 1 6 0v1" />
              </svg>
            </HeaderIcon>
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-primary">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="md:hidden">
        <div className="relative flex h-[60px] items-center justify-between px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center text-secondary"
          >
            <span className="sr-only">Open menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-0.5 w-5 bg-secondary" />
              <span className="block h-0.5 w-5 bg-secondary" />
              <span className="block h-0.5 w-5 bg-secondary" />
            </span>
          </button>

          <Link href="/" aria-label="Ga naar home" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="https://www.figma.com/api/mcp/asset/84355b1b-5d5d-40b1-971e-65212ce06220"
              alt="Fioresque logo"
              width={70}
              height={45}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-1">
            <Link href="#" aria-label="Zoeken">
              <HeaderIcon label="Zoeken">
                <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </HeaderIcon>
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center"
              aria-label={mounted && count > 0 ? `Winkelwagen, ${count} items` : "Winkelwagen"}
            >
              <HeaderIcon label="Winkelwagen">
                <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 7h12l-1.5 11h-9z" />
                  <path d="M9 7V6a3 3 0 0 1 6 0v1" />
                </svg>
              </HeaderIcon>
              {mounted && count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-primary">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-secondary/30 bg-primary px-5 py-4" aria-label="Mobiele navigatie">
            <div className="grid gap-3 font-heading text-sm tracking-[0.14em] text-secondary">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                SHOP
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                COLLECTIONS
              </Link>
              <Link href="/over-ons" onClick={() => setMobileMenuOpen(false)}>
                ABOUT US
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
