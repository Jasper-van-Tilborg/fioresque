import Link from "next/link";
import Image from "next/image";
import { fetchPrintifyProducts } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";
import { ProductVisibilityToggle } from "@/components/admin/product-visibility-toggle";

export const metadata = {
  title: "Producten – Fioresque Admin",
};

export default async function AdminProductsPage() {
  let products: Array<{
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    variantCount: number;
  }> = [];
  let hiddenIds = new Set<string>();
  let error: string | null = null;

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (shopId) {
      hiddenIds = await getHiddenProductIds();
      const data = await fetchPrintifyProducts(shopId, 1, 100);
      products = data.data.map((p) => {
        const price =
          p.variants?.length > 0
            ? Math.min(...p.variants.map((v) => Math.round((v.price ?? 0) * 100)))
            : 0;
        const imageUrl = p.images?.length > 0 ? (p.images[0] as { src: string }).src : null;
        return {
          id: p.id,
          title: p.title,
          price,
          imageUrl,
          variantCount: p.variants?.length ?? 0,
        };
      });
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Kon producten niet laden";
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-extrabold text-[#302D2E]">Producten</h1>
      {error ? (
        <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#302D2E]/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#302D2E]/10 bg-[#FAF9F6] text-left">
                <th className="px-4 py-3 font-medium text-[#302D2E]">Afbeelding</th>
                <th className="px-4 py-3 font-medium text-[#302D2E]">Product</th>
                <th className="px-4 py-3 font-medium text-[#302D2E]">Prijs</th>
                <th className="px-4 py-3 font-medium text-[#302D2E]">Varianten</th>
                <th className="px-4 py-3 font-medium text-[#302D2E]">Zichtbaar</th>
                <th className="px-4 py-3 font-medium text-[#302D2E]">Acties</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#302D2E]/5 hover:bg-[#FAF9F6]/50">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-[#302D2E]/5">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <span className="text-[#302D2E]/40 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#302D2E]">{p.title}</td>
                  <td className="px-4 py-3 text-[#302D2E]">
                    &euro; {(p.price / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[#302D2E]">{p.variantCount}</td>
                  <td className="px-4 py-3">
                    <ProductVisibilityToggle
                      printifyProductId={p.id}
                      hidden={hiddenIds.has(p.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[#5E825F] hover:underline"
                    >
                      Detail
                    </Link>
                    {" · "}
                    <a
                      href={`${baseUrl}/shop/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5E825F] hover:underline"
                    >
                      Webshop
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="py-8 text-center text-[#302D2E]/70">Geen producten (controleer PRINTIFY_SHOP_ID)</p>
          )}
        </div>
      )}
    </div>
  );
}
