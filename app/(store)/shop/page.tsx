import { getShopProducts } from "@/lib/shop-products";
import {
  buildColorOptions,
  filterAndSortShopProducts,
  parseShopListParams,
} from "@/lib/shop-query";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";
import { ShopToolbarClient } from "@/components/shop/shop-toolbar-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop – Fioresque Artwear",
  description: "Bekijk alle producten van Fioresque Artwear. Unieke designs op kwaliteitskleding.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseShopListParams(raw);

  const all = await getShopProducts();
  const colorOptions = buildColorOptions(all);
  const filtered = filterAndSortShopProducts(all, listParams);
  const filteredTotal = filtered.length;
  const take = Math.min(listParams.take, Math.max(filteredTotal, 0));
  const visible = filtered.slice(0, take);

  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="flex items-end justify-between gap-4 border-b border-secondary/15 pb-5">
          <h1 className="font-heading text-[22px] font-bold tracking-[0.06em] text-secondary md:text-[2rem]">
            Shop
          </h1>
          <p className="shrink-0 text-[12px] tracking-[0.06em] text-secondary/70 md:text-sm">
            {filteredTotal} {filteredTotal === 1 ? "product" : "producten"}
          </p>
        </div>

        <ShopToolbarClient listParams={listParams} colorOptions={colorOptions} />

        {all.length === 0 ? (
          <p className="mt-12 text-[14px] leading-relaxed text-secondary/65">
            Geen producten geladen. Controleer PRINTIFY_SHOP_ID en PRINTIFY_API_KEY in je omgeving.
          </p>
        ) : (
          <ShopProductGrid
            products={visible}
            listParams={listParams}
            filteredTotal={filteredTotal}
          />
        )}
      </div>
    </div>
  );
}
