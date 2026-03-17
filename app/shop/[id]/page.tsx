import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchPrintifyProduct } from "@/lib/printify";
import { AddToCart } from "@/components/product/add-to-cart";
import type { ProductVariant } from "@/lib/product-utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) return { title: "Product" };
  const product = await fetchPrintifyProduct(shopId, id);
  if (!product) return { title: "Product" };
  return {
    title: `${product.title} – Fioresque Artwear`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!shopId) notFound();

  const product = await fetchPrintifyProduct(shopId, id);
  if (!product) notFound();

  const imageUrl =
    product.images?.length > 0 ? (product.images[0] as { src: string }).src : null;
  const variants: ProductVariant[] = (product.variants ?? []).map((v) => ({
    id: v.id,
    title: v.title ?? `Variant ${v.id}`,
    price: Math.round((v.price ?? 0) * 100),
  }));
  const minPrice =
    variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;
  const priceEur = (minPrice / 100).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-primary/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-primary/40">
              Geen afbeelding
            </div>
          )}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-2 text-xl font-semibold text-primary">&euro; {priceEur}</p>
          {product.description && (
            <div className="mt-4 text-primary/80 prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>
          )}
          <AddToCart
            productId={product.id}
            printifyProductId={product.id}
            slug={product.id}
            title={product.title}
            imageUrl={imageUrl}
            variants={variants}
          />
        </div>
      </div>
    </div>
  );
}
