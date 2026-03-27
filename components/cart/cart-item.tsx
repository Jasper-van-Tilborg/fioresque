"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

type CartItemProps = {
  item: {
    productId: string;
    slug: string;
    title: string;
    imageUrl: string | null;
    variantId: number;
    variantLabel: string;
    price: number;
    quantity: number;
  };
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const priceEur = ((item.price * item.quantity) / 100).toFixed(2);

  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 py-5">
      <Link
        href={`/shop/${item.slug}`}
        className="relative h-[104px] w-[104px] shrink-0 overflow-hidden border border-secondary/15 bg-primary/40"
      >
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-secondary/45">
            Geen afbeelding
          </div>
        )}
      </Link>
      <div className="min-w-0 h-[104px]">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/shop/${item.slug}`}
            className="line-clamp-1 text-base font-semibold text-secondary hover:text-secondary/85"
          >
            {item.title}
          </Link>
          <p className="shrink-0 text-base leading-none text-secondary/75">&euro; {priceEur}</p>
        </div>
        <p className="mt-1 text-sm text-secondary/62">{item.variantLabel}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="inline-flex h-10 items-center overflow-hidden border border-secondary/22">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="inline-flex h-full w-10 items-center justify-center border-r border-secondary/22 text-base text-secondary/78 transition hover:bg-secondary/10"
              aria-label="Minder"
            >
              −
            </button>
            <span className="inline-flex h-full min-w-10 items-center justify-center border-r border-secondary/22 px-3 text-sm font-medium text-secondary">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="inline-flex h-full w-10 items-center justify-center text-base text-secondary/78 transition hover:bg-secondary/10"
              aria-label="Meer"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-end text-sm text-secondary/65 underline decoration-secondary/35 underline-offset-2 transition hover:text-secondary"
            onClick={() => removeItem(item.productId, item.variantId)}
          >
            Verwijder
          </button>
        </div>
      </div>
    </div>
  );
}
