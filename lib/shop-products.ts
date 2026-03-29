import { fetchPrintifyProducts } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";
import { mapPrintifyToShopProduct, type ShopProduct } from "@/lib/shop-product-mapper";

/**
 * Zelfde Printify-pad als getFeaturedProducts, maar alle zichtbare producten (max 100).
 */
export async function getShopProducts(): Promise<ShopProduct[]> {
  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) return [];

    const hiddenIds = await getHiddenProductIds();
    const data = await fetchPrintifyProducts(shopId, 1, 100);

    const products: ShopProduct[] = [];
    for (const p of data.data) {
      if (hiddenIds.has(p.id)) continue;
      try {
        products.push(mapPrintifyToShopProduct(p));
      } catch {
        /* sla defect Printify-item over */
      }
    }
    return products;
  } catch {
    return [];
  }
}
