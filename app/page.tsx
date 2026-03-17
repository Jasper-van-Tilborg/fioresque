import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <div>
      <section className="border-b border-primary/10 bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Fioresque Artwear
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary/80">
            Unieke designs op kwaliteitskleding. Strak, modern en met oog voor detail.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button size="lg">Naar de shop</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-extrabold text-primary sm:text-3xl">
          Uitgelichte producten
        </h2>
        {featured.length > 0 ? (
          <div className="mt-8">
            <ProductGrid products={featured} priorityFirst={3} />
          </div>
        ) : (
          <p className="mt-6 text-primary/70">
            Binnenkort vind je hier onze producten. Zet PRINTIFY_SHOP_ID in je .env om producten te tonen.
          </p>
        )}
        {featured.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/shop">
              <Button variant="outline">Alle producten</Button>
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-primary/10 bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-2xl font-extrabold text-primary">
            Over Fioresque
          </h2>
          <p className="mt-4 max-w-2xl text-primary/80">
            Fioresque Artwear staat voor strakke kleding met unieke, artistieke prints.
            We werken met print-on-demand zodat elke bestelling met zorg wordt gemaakt.
          </p>
          <Link href="/over-ons" className="mt-6 inline-block font-medium text-accent hover:underline">
            Lees ons verhaal →
          </Link>
        </div>
      </section>
    </div>
  );
}
