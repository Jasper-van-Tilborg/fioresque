import { fetchPrintifyProducts } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";

export type FeaturedProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
};

export async function getFeaturedProducts(limit = 6): Promise<FeaturedProduct[]> {
  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) return [];
    const hiddenIds = await getHiddenProductIds();
    const data = await fetchPrintifyProducts(shopId, 1, 50);
    const filtered = data.data.filter((p) => !hiddenIds.has(p.id));
    return filtered.slice(0, limit).map((p) => {
      const minPrice =
        p.variants?.length > 0
          ? Math.min(...p.variants.map((v) => Math.round((v.price ?? 0) * 100)))
          : 0;
      const imageUrl =
        p.images?.length > 0 ? (p.images[0] as { src: string }).src : null;
      return {
        id: p.id,
        title: p.title,
        price: minPrice,
        imageUrl,
      };
    });
  } catch {
    return [];
  }
}
