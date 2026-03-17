"use client";

import type { ProductVariant } from "@/lib/product-utils";

type SizeSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: number | null;
  onSelect: (variantId: number) => void;
  disabled?: boolean;
};

export function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
  disabled,
}: SizeSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-primary">Maat</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(v.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              selectedVariantId === v.id
                ? "border-accent bg-accent text-secondary"
                : "border-primary/20 bg-secondary text-primary hover:border-primary/40"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {v.title}
          </button>
        ))}
      </div>
    </div>
  );
}
