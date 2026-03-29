import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import type { ShopProduct } from "@/lib/shop-product-mapper";
import { serializeShopListParams, type ShopListParams } from "@/lib/shop-query";

type ShopProductGridProps = {
  products: ShopProduct[];
  listParams: ShopListParams;
  filteredTotal: number;
};

export function ShopProductGrid({ products, listParams, filteredTotal }: ShopProductGridProps) {
  const shown = products.length;
  const hasMore = shown < filteredTotal;
  const nextTake = listParams.take + 6;
  const loadMoreHref =
    hasMore
      ? `/shop?${serializeShopListParams({ ...listParams, take: Math.min(nextTake, filteredTotal) })}`
      : "";

  if (products.length === 0) {
    return (
      <p className="mt-12 text-[14px] leading-relaxed text-secondary/65">
        Geen producten gevonden. Pas je zoekopdracht of filters aan.
      </p>
    );
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-[10px] md:mt-10">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            id={p.id}
            title={p.title}
            price={p.price}
            imageUrl={p.imageUrl}
            priority={i < 4}
            isNew={p.isNew}
            variant="shop"
            swatches={p.swatchHexes}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-secondary/10 pt-8">
          <p className="text-[12px] tracking-[0.04em] text-secondary/60">
            {shown} van {filteredTotal} producten
          </p>
          <Link
            href={loadMoreHref}
            className="inline-flex min-h-11 items-center justify-center border border-secondary/35 bg-transparent px-10 text-[12px] font-medium tracking-[0.1em] text-secondary transition hover:bg-secondary/10"
          >
            Laad meer
          </Link>
        </div>
      ) : null}
    </>
  );
}
