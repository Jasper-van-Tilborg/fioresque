"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { CartItem } from "@/components/cart/cart-item";
import { useCartStore } from "@/store/cart-store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());
  const count = useCartStore((s) => s.getCount());
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const totalEur = (total / 100).toFixed(2);
  const visibleItems = isClient ? items : [];
  const visibleCount = isClient ? count : 0;
  const visibleTotalEur = isClient ? totalEur : "0.00";

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const drawerContent = (
    <div
      className={`fixed inset-0 z-70 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Sluit winkelwagen"
        onClick={onClose}
        className={`absolute inset-0 bg-primary/70 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Winkelwagen"
        className={`absolute right-0 top-0 flex h-full w-full max-w-full flex-col border-l-0 bg-primary text-secondary shadow-2xl transition-transform duration-300 ease-out md:max-w-[430px] md:border-l md:border-secondary/20 lg:max-w-[480px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b-2 border-secondary px-5">
          <div className="flex flex-col justify-center">
            <h2 className="font-heading text-sm leading-none tracking-[0.15em] text-secondary">Winkelwagen</h2>
            <p className="mt-1 text-sm text-secondary/70">
              {visibleCount} product{visibleCount === 1 ? "" : "en"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-12 items-center justify-center border border-transparent text-secondary/90 transition hover:border-secondary/30 hover:bg-secondary/10 hover:text-secondary md:size-10"
            aria-label="Sluit winkelwagen"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
          {visibleItems.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-secondary/85">Je winkelwagen is leeg.</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 inline-flex h-11 items-center justify-center border border-secondary/25 px-5 font-heading text-sm font-medium tracking-[0.08em] text-secondary transition hover:bg-secondary/10"
              >
                NAAR SHOP
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-secondary/15">
              {visibleItems.map((item) => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-secondary/18 px-5 pb-5 pt-5">
          <form className="flex items-stretch border border-secondary/22">
            <input
              type="text"
              placeholder="Kortingscode"
              className="h-11 flex-1 bg-primary px-4 text-sm text-secondary placeholder:text-secondary/50 focus:outline-none"
            />
            <button
              type="button"
              className="h-11 border-l border-secondary/22 bg-secondary/10 px-4 font-heading text-xs font-semibold tracking-[0.12em] text-secondary transition hover:bg-secondary/16"
            >
              Toepassen
            </button>
          </form>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <p className="text-secondary/72">Subtotaal</p>
              <p className="text-secondary/72">&euro;{visibleTotalEur}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-secondary/72">Verzending</p>
              <p className="text-secondary/72">Gratis</p>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-secondary/16 pt-2.5">
              <p className="font-heading text-lg font-semibold text-secondary">Totaal</p>
              <p className="font-heading text-lg font-semibold text-secondary">&euro;{visibleTotalEur}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={visibleCount === 0}
            className="mt-4 inline-flex h-12 w-full items-center justify-center bg-secondary px-6 font-heading text-sm font-semibold tracking-[0.14em] text-primary transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Afrekenen
          </button>
        </div>
      </aside>
    </div>
  );

  if (!isClient) return null;
  return createPortal(drawerContent, document.body);
}
