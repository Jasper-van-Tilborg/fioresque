"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { SizeSelector } from "./size-selector";
import { Button } from "@/components/ui/button";
import type { ProductVariant } from "@/lib/product-utils";

type AddToCartProps = {
  productId: string;
  printifyProductId: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  variants: ProductVariant[];
};

export function AddToCart({
  productId,
  printifyProductId,
  slug,
  title,
  imageUrl,
  variants,
}: AddToCartProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const price = selectedVariant?.price ?? 0;
  const variantLabel = selectedVariant?.title ?? "—";

  function handleAddToCart() {
    if (!selectedVariantId || !selectedVariant) return;
    addItem(
      {
        productId,
        printifyProductId,
        slug,
        title,
        imageUrl,
        variantId: selectedVariantId,
        variantLabel,
        price,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (variants.length === 0) {
    return (
      <p className="mt-6 text-primary/70">Dit product is momenteel niet beschikbaar.</p>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <SizeSelector
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium text-primary">
          Aantal
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
          className="w-20 rounded border border-primary/20 bg-secondary px-3 py-2 text-primary"
        />
      </div>
      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={!selectedVariantId || added}
      >
        {added ? "Toegevoegd!" : "Toevoegen aan winkelwagen"}
      </Button>
    </div>
  );
}
