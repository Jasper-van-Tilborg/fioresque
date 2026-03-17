import { NextRequest } from "next/server";
import { fetchPrintifyProducts } from "@/lib/printify";
import { apiErrorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      return Response.json({ products: [], total: 0 });
    }

    const { searchParams } = new URL(request.url);
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const page = Number(searchParams.get("page")) || 1;

    const data = await fetchPrintifyProducts(shopId, page, limit);
    const minPrice = minPriceParam != null && !Number.isNaN(Number(minPriceParam)) ? Number(minPriceParam) * 100 : null;
    const maxPrice = maxPriceParam != null && !Number.isNaN(Number(maxPriceParam)) ? Number(maxPriceParam) * 100 : null;

    let products = data.data.map((p) => {
      const price =
        p.variants?.length > 0
          ? Math.min(...p.variants.map((v) => Math.round((v.price ?? 0) * 100)))
          : 0;
      const imageUrl = p.images?.length > 0 ? (p.images[0] as { src: string }).src : null;
      return { id: p.id, title: p.title, price, imageUrl };
    });

    if (minPrice != null) products = products.filter((p) => p.price >= minPrice);
    if (maxPrice != null) products = products.filter((p) => p.price <= maxPrice);

    const total = data.total;
    return Response.json({ products, total });
  } catch (error) {
    return apiErrorResponse(error, 500);
  }
}
