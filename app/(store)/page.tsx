import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/products";
import { MobileSummerCarousel } from "@/components/product/mobile-summer-carousel";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary">
        <Image
          src="/fioresque.gif"
          alt="Fioresque hero"
          fill
          className="object-cover object-center md:object-center"
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-primary md:h-28" />
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-end px-4 pb-14 text-center sm:px-6 md:min-h-[84svh] md:pb-28">
          <Link href="/shop" className="inline-block">
            <Button
              variant="outline"
              className="min-h-11 border-secondary px-7 py-2 text-[13px] tracking-[0.12em] text-secondary hover:bg-secondary hover:text-primary md:px-10 md:py-3 md:text-base"
            >
              VIEW THE COLLECTION
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-primary py-12 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-[22px] font-bold text-secondary md:text-[2.2rem]">
              Summer Collection &apos;26
            </h2>
            <Link href="/shop" className="text-xs tracking-[0.06em] text-secondary/70 underline hover:text-secondary md:text-sm">
              View all
            </Link>
          </div>

          {featured.length > 0 ? (
            <>
              <MobileSummerCarousel products={featured.slice(0, 3)} />
              <div className="mt-9 hidden md:block">
                <ProductGrid products={featured.slice(0, 3)} priorityFirst={3} />
              </div>
            </>
          ) : (
            <p className="mt-8 max-w-3xl text-base leading-7 text-secondary/80 md:text-lg md:leading-8">
              Binnenkort vind je hier onze producten. Zet PRINTIFY_SHOP_ID in je .env om producten te tonen.
            </p>
          )}
        </div>
      </section>

      <section className="bg-secondary py-12 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-[10px] tracking-widest text-accent md:text-sm md:tracking-[0.18em]">OUR STORY</p>
            <h3 className="mt-2 font-heading text-[22px] font-extrabold tracking-[0.08em] text-primary md:mt-4 md:text-5xl">
              Fioresque
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 md:hidden">
              <div className="relative min-h-[270px] overflow-hidden">
                <Image
                  src="https://www.figma.com/api/mcp/asset/047406a7-a848-4865-a207-a069aed214be"
                  alt="Flower artwork"
                  fill
                  className="object-cover"
                  sizes="45vw"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="relative min-h-[126px] overflow-hidden">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/c9e43cc5-0c06-4578-bc98-f0b713ea780a"
                    alt="Nature mood image"
                    fill
                    className="object-cover"
                    sizes="45vw"
                  />
                </div>
                <div className="relative min-h-[126px] overflow-hidden">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/4e56f329-12b5-4ad8-a430-69661bcda726"
                    alt="Jellyfish design"
                    fill
                    className="object-cover"
                    sizes="45vw"
                  />
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-lg text-[13px] leading-6 tracking-[0.03em] text-primary/85 md:mt-8 md:text-base md:leading-8 md:tracking-[0.04em]">
              Fioresque started as something personal. A shared love for clothing that
              doesn&apos;t shout. No logos, no hype. Just clean pieces inspired by nature,
              designed to last. We believe what you wear should feel like you: effortless,
              timeless, yours.
            </p>
            <Link href="/over-ons" className="mt-6 inline-block md:mt-12">
              <Button size="md" variant="secondary" className="px-8 py-2 text-[13px] tracking-[0.08em] md:px-10">
                READ OUR STORY
              </Button>
            </Link>
          </div>

          <div className="hidden grid-cols-2 gap-5 md:grid">
            <div className="relative col-span-1 row-span-2 min-h-[420px] overflow-hidden">
              <Image
                src="https://www.figma.com/api/mcp/asset/047406a7-a848-4865-a207-a069aed214be"
                alt="Flower artwork"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 40vw"
              />
            </div>
            <div className="relative min-h-[200px] overflow-hidden">
              <Image
                src="https://www.figma.com/api/mcp/asset/c9e43cc5-0c06-4578-bc98-f0b713ea780a"
                alt="Nature mood image"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 20vw"
              />
            </div>
            <div className="relative min-h-[200px] overflow-hidden">
              <Image
                src="https://www.figma.com/api/mcp/asset/4e56f329-12b5-4ad8-a430-69661bcda726"
                alt="Jellyfish design"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 20vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
          <div className="grid grid-cols-2 gap-4 md:min-h-[340px] md:bg-secondary/35">
            <div className="min-h-[167px] bg-secondary/35 md:hidden" />
            <div className="min-h-[167px] bg-secondary/35 md:hidden" />
            <div className="min-h-[167px] bg-secondary/35 md:hidden" />
            <div className="min-h-[167px] bg-secondary/35 md:hidden" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] tracking-widest text-accent md:text-sm md:tracking-[0.18em]">ON INSTAGRAM</p>
            <h3 className="mt-2 max-w-md font-heading text-[22px] font-extrabold tracking-[0.08em] text-secondary md:mt-4 md:text-5xl">
              See how people wear Fioresque
            </h3>
            <p className="mt-4 max-w-md text-[13px] leading-6 tracking-[0.04em] text-secondary/85 md:mt-6 md:text-base md:leading-8">
              Follow us for daily inspiration, behind the scenes and new drops before anyone else.
            </p>
            <p className="mt-6 text-sm font-semibold text-secondary/60 md:mt-9 md:text-base">@fioresque</p>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block md:mt-9"
            >
              <Button
                variant="outline"
                className="min-h-11 border-secondary px-6 py-2 text-[13px] tracking-[0.08em] text-secondary hover:bg-secondary hover:text-primary md:px-10 md:py-3 md:text-base"
              >
                FOLLOW ON INSTAGRAM
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
