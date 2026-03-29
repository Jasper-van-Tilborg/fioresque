"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCartStore } from "@/store/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";

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
      className="inline-flex size-12 items-center justify-center border border-transparent text-secondary/90 transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary md:size-10"
    >
      {children}
    </span>
  );
}

export function Header() {
  const count = useCartStore((s) => s.getCount());
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchClosing, setMobileSearchClosing] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      router.push("/shop");
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  const closeMobileMenu = () => {
    if (!mobileMenuOpen || mobileMenuClosing) return;
    setMobileMenuClosing(true);
  };

  useEffect(() => {
    if (!mobileMenuClosing) return;
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [mobileMenuClosing]);

  useEffect(() => {
    if (!mobileSearchClosing) return;
    const timer = setTimeout(() => {
      setMobileSearchOpen(false);
      setMobileSearchClosing(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [mobileSearchClosing]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  const mobileMenuContent = mobileMenuOpen ? (
    <nav
      className={`fixed inset-x-0 top-[60px] z-60 h-[calc(100dvh-60px)] border-t border-secondary/20 bg-primary ${
        mobileMenuClosing ? "mobile-menu-exit" : "mobile-menu-enter"
      }`}
      aria-label="Mobiele navigatie"
    >
      <div className="flex h-full flex-col px-5">
        <div className="flex items-center justify-between border-b border-secondary/20 py-4">
          <p className="font-heading text-[11px] tracking-[0.14em] text-secondary/65">MENU</p>
          <button
            type="button"
            aria-label="Sluit menu"
            onClick={closeMobileMenu}
            className="inline-flex size-12 items-center justify-center border border-transparent text-secondary/90 transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="mt-3 border-b border-secondary/20">
          <Link
            href="/shop"
            onClick={closeMobileMenu}
            className="flex items-center justify-between border-b border-secondary/20 py-4"
          >
            <span className="font-heading text-[30px] leading-none text-secondary">Shop</span>
            <span className="text-xl text-secondary/75">›</span>
          </Link>
          <Link
            href="/shop"
            onClick={closeMobileMenu}
            className="flex items-center justify-between border-b border-secondary/20 py-4"
          >
            <span className="font-heading text-[30px] leading-none text-secondary">Collections</span>
            <span className="text-xl text-secondary/75">›</span>
          </Link>
          <Link
            href="/over-ons"
            onClick={closeMobileMenu}
            className="flex items-center justify-between py-4"
          >
            <span className="font-heading text-[30px] leading-none text-secondary">About us</span>
            <span className="text-xl text-secondary/75">›</span>
          </Link>
        </div>

        <div className="mt-4 border-b border-secondary/20 pb-4">
          <Link href="#" className="flex items-center gap-3 py-2 text-base text-secondary/88">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m12 20-1.2-1.1C6 14.6 3 11.8 3 8.3A4.3 4.3 0 0 1 7.3 4C9 4 10.7 4.8 12 6.1 13.3 4.8 15 4 16.7 4A4.3 4.3 0 0 1 21 8.3c0 3.5-3 6.3-7.8 10.6z" />
            </svg>
            <span className="font-heading">Wishlist</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 py-2 text-base text-secondary/88">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20a7 7 0 0 1 14 0" />
            </svg>
            <span className="font-heading">Profiel</span>
          </Link>
        </div>

        <div className="mt-auto flex items-center py-3 font-heading text-xs tracking-[0.08em] text-secondary/72">
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noreferrer">
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </nav>
  ) : null;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-secondary bg-primary/95 backdrop-blur">
      <div className="mx-auto hidden h-[78px] max-w-6xl items-center justify-between px-4 sm:px-6 md:flex">
        <nav className="flex items-center gap-9" aria-label="Hoofdnavigatie">
          <Link
            href="/shop"
            className={`relative font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-200 ${
              pathname.startsWith("/shop")
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            SHOP
          </Link>
          <Link
            href="/shop"
            className={`relative font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-200 ${
              pathname.startsWith("/shop")
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            COLLECTIONS
          </Link>
          <Link
            href="/over-ons"
            className={`relative font-heading text-sm tracking-[0.15em] text-secondary/90 transition hover:text-secondary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-200 ${
              pathname === "/over-ons"
                ? "after:w-full"
                : "after:w-0 hover:after:w-full"
            }`}
          >
            ABOUT US
          </Link>
        </nav>

        <Link
          href="/"
          className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Ga naar home"
        >
          <Image
            src="https://www.figma.com/api/mcp/asset/84355b1b-5d5d-40b1-971e-65212ce06220"
            alt="Fioresque logo"
            width={90}
            height={58}
            className="h-12 w-auto object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:drop-shadow-[0_0_12px_rgba(250,249,246,0.38)] motion-reduce:transition-none"
            priority
          />
        </Link>

        <nav className="flex items-center gap-3" aria-label="Gebruikersacties">
          <form
            onSubmit={handleSearchSubmit}
            className={`overflow-hidden border border-secondary/40 transition-all duration-200 ${
              desktopSearchOpen ? "w-56 opacity-100" : "w-0 border-transparent opacity-0"
            }`}
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek product..."
              className="h-9 w-full bg-primary px-3 text-sm text-secondary placeholder:text-secondary/50 focus:outline-none"
            />
          </form>
          <button
            type="button"
            aria-label="Zoeken"
            onClick={() => setDesktopSearchOpen((v) => !v)}
          >
            <HeaderIcon label="Zoeken">
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </HeaderIcon>
          </button>
          <Link href="#" aria-label="Favorieten">
            <HeaderIcon label="Favorieten">
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 20-1.2-1.1C6 14.6 3 11.8 3 8.3A4.3 4.3 0 0 1 7.3 4C9 4 10.7 4.8 12 6.1 13.3 4.8 15 4 16.7 4A4.3 4.3 0 0 1 21 8.3c0 3.5-3 6.3-7.8 10.6z" />
              </svg>
            </HeaderIcon>
          </Link>
          <Link href="#" aria-label="Profiel">
            <HeaderIcon label="Profiel">
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </HeaderIcon>
          </Link>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="relative inline-flex items-center"
            aria-label={mounted && count > 0 ? `Winkelwagen, ${count} items` : "Winkelwagen"}
          >
            <HeaderIcon label="Winkelwagen">
              <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 7h12l-1.5 11h-9z" />
                <path d="M9 7V6a3 3 0 0 1 6 0v1" />
              </svg>
            </HeaderIcon>
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-primary">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="md:hidden">
        <div className="relative flex h-[60px] items-center justify-between px-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => {
              if (mobileMenuOpen) {
                closeMobileMenu();
                return;
              }
              setMobileMenuClosing(false);
              setMobileMenuOpen(true);
            }}
            className="inline-flex h-11 w-11 items-center justify-center text-secondary"
          >
            <span className="sr-only">Open menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-0.5 w-5 bg-secondary" />
              <span className="block h-0.5 w-5 bg-secondary" />
              <span className="block h-0.5 w-5 bg-secondary" />
            </span>
          </button>

          <Link
            href="/"
            aria-label="Ga naar home"
            className="group absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src="https://www.figma.com/api/mcp/asset/84355b1b-5d5d-40b1-971e-65212ce06220"
              alt="Fioresque logo"
              width={70}
              height={45}
              className="h-11 w-auto object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:drop-shadow-[0_0_10px_rgba(250,249,246,0.35)] motion-reduce:transition-none"
              priority
            />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoeken"
              onClick={() => {
                if (mobileSearchOpen) {
                  setMobileSearchClosing(true);
                  return;
                }
                setMobileSearchClosing(false);
                setMobileSearchOpen(true);
              }}
            >
              <HeaderIcon label="Zoeken">
                <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </HeaderIcon>
            </button>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative inline-flex items-center"
              aria-label={mounted && count > 0 ? `Winkelwagen, ${count} items` : "Winkelwagen"}
            >
              <HeaderIcon label="Winkelwagen">
                <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 7h12l-1.5 11h-9z" />
                  <path d="M9 7V6a3 3 0 0 1 6 0v1" />
                </svg>
              </HeaderIcon>
              {mounted && count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-primary">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-secondary/30 bg-primary px-5 transition-[max-height,opacity,padding] duration-300 ease-out ${
            mobileSearchOpen && !mobileSearchClosing
              ? "max-h-24 py-3 opacity-100"
              : "max-h-0 py-0 opacity-0"
          }`}
        >
          <form onSubmit={handleSearchSubmit}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek product..."
              className="h-11 w-full border border-secondary/40 bg-primary px-3 text-sm text-secondary placeholder:text-secondary/50 focus:outline-none"
            />
          </form>
        </div>

      </div>
      {mounted && mobileMenuContent ? createPortal(mobileMenuContent, document.body) : null}
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
}
