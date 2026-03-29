import { fetchPrintifyProducts } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";
import { mapPrintifyToShopProduct } from "@/lib/shop-product-mapper";

export type FeaturedProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  isNew: boolean;
};

export async function getFeaturedProducts(limit = 6): Promise<FeaturedProduct[]> {
  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) return [];
    const hiddenIds = await getHiddenProductIds();
    const data = await fetchPrintifyProducts(shopId, 1, 50);
    const filtered = data.data.filter((p) => !hiddenIds.has(p.id));
    return filtered.slice(0, limit).map((p) => {
      const sp = mapPrintifyToShopProduct(p);
      return {
        id: sp.id,
        title: sp.title,
        price: sp.price,
        imageUrl: sp.imageUrl,
        isNew: sp.isNew,
      };
    });
  } catch {
    return [];
  }
}
