import { Suspense } from "react";
import { fetchPrintifyProducts } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopFilters } from "@/components/shop/shop-filters";

type SearchParams = { category?: string; minPrice?: string; maxPrice?: string };

export const metadata = {
  title: "Shop – Fioresque Artwear",
  description: "Bekijk alle producten van Fioresque Artwear. Unieke designs op kwaliteitskleding.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const minPriceParam = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPriceParam = params.maxPrice ? Number(params.maxPrice) : undefined;

  let products: { id: string; title: string; price: number; imageUrl: string | null }[] = [];
  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const hiddenIds = await getHiddenProductIds();
    if (shopId) {
      const data = await fetchPrintifyProducts(shopId, 1, 100);
      products = data.data
        .filter((p) => !hiddenIds.has(p.id))
        .map((p) => {
          const price =
            p.variants?.length > 0
              ? Math.min(...p.variants.map((v) => Math.round((v.price ?? 0) * 100)))
              : 0;
          const imageUrl = p.images?.length > 0 ? (p.images[0] as { src: string }).src : null;
          return { id: p.id, title: p.title, price, imageUrl };
        });
      const minPrice = minPriceParam != null && !Number.isNaN(minPriceParam) ? minPriceParam * 100 : null;
      const maxPrice = maxPriceParam != null && !Number.isNaN(maxPriceParam) ? maxPriceParam * 100 : null;
      if (minPrice != null) products = products.filter((p) => p.price >= minPrice);
      if (maxPrice != null) products = products.filter((p) => p.price <= maxPrice);
    }
  } catch {
    products = [];
  }

  const categories: string[] = [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">Shop</h1>
      <Suspense fallback={null}>
        <ShopFilters categories={categories} />
      </Suspense>
      {products.length > 0 ? (
        <div className="mt-6 sm:mt-8">
          <ProductGrid products={products} />
        </div>
      ) : (
        <p className="mt-8 text-primary/70">
          Geen producten gevonden. Controleer PRINTIFY_SHOP_ID of pas de filters aan.
        </p>
      )}
    </div>
  );
}
