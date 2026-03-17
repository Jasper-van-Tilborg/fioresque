import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPrintifyProduct } from "@/lib/printify";
import { getHiddenProductIds } from "@/lib/hidden-products";
import { ProductVisibilityToggle } from "@/components/admin/product-visibility-toggle";

export const metadata = {
  title: "Product – Fioresque Admin",
};

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) notFound();

  const product = await fetchPrintifyProduct(shopId, id);
  if (!product) notFound();

  const hiddenIds = await getHiddenProductIds();
  const hidden = hiddenIds.has(product.id);
  const imageUrl = product.images?.length > 0 ? (product.images[0] as { src: string }).src : null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold text-[#302D2E]">
          {product.title}
        </h1>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-[#5E825F] hover:underline"
        >
          ← Terug naar producten
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
          <h2 className="font-heading font-extrabold text-[#302D2E]">Afbeelding</h2>
          <div className="relative mt-3 aspect-square overflow-hidden rounded-lg bg-[#302D2E]/5">
            {imageUrl ? (
              <Image src={imageUrl} alt={product.title} fill className="object-cover" />
            ) : (
              <span className="text-[#302D2E]/40">Geen afbeelding</span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <p className="mt-2 text-sm text-[#302D2E]/70">
              +{product.images.length - 1} extra afbeelding(en)
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
            <h2 className="font-heading font-extrabold text-[#302D2E]">Zichtbaarheid</h2>
            <div className="mt-3 flex items-center gap-2">
              <ProductVisibilityToggle printifyProductId={product.id} hidden={hidden} />
              <a
                href={`${baseUrl}/shop/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#5E825F] hover:underline"
              >
                Bekijk in webshop →
              </a>
            </div>
          </div>

          {product.description && (
            <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
              <h2 className="font-heading font-extrabold text-[#302D2E]">Beschrijving</h2>
              <p className="mt-2 text-sm text-[#302D2E]/90">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[#302D2E]/10 bg-white p-4">
        <h2 className="font-heading font-extrabold text-[#302D2E]">Varianten</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#302D2E]/10 text-left">
                <th className="pb-2 font-medium text-[#302D2E]">ID</th>
                <th className="pb-2 font-medium text-[#302D2E]">Titel</th>
                <th className="pb-2 font-medium text-[#302D2E]">Prijs</th>
              </tr>
            </thead>
            <tbody>
              {(product.variants ?? []).map((v) => (
                <tr key={v.id} className="border-b border-[#302D2E]/5">
                  <td className="py-2 font-mono text-[#302D2E]">{v.id}</td>
                  <td className="py-2 text-[#302D2E]">{v.title ?? "—"}</td>
                  <td className="py-2 text-[#302D2E]">
                    &euro; {((v.price ?? 0) * 0.01).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!product.variants || product.variants.length === 0) && (
            <p className="py-4 text-[#302D2E]/70">Geen varianten</p>
          )}
        </div>
      </div>
    </div>
  );
}
