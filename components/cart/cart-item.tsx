"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

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
    <div className="flex gap-4 border-b border-primary/10 py-4 last:border-0">
      <Link href={`/shop/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-primary/5">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40 text-xs">
            Geen afbeelding
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/shop/${item.slug}`} className="font-medium text-primary hover:text-accent">
          {item.title}
        </Link>
        <p className="text-sm text-primary/70">{item.variantLabel}</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            className="h-8 w-8 rounded border border-primary/20 text-primary hover:bg-primary/5"
            aria-label="Minder"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            className="h-8 w-8 rounded border border-primary/20 text-primary hover:bg-primary/5"
            aria-label="Meer"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary">&euro; {priceEur}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 text-primary/70"
          onClick={() => removeItem(item.productId, item.variantId)}
        >
          Verwijderen
        </Button>
      </div>
    </div>
  );
}
