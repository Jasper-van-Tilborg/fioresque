import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/15 bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="https://www.figma.com/api/mcp/asset/a875808d-d870-4c04-b155-31b364ceacc0"
                alt="Fioresque mark"
                width={34}
                height={28}
                className="h-7 w-auto md:h-8"
              />
              <Image
                src="https://www.figma.com/api/mcp/asset/933e39a8-a442-4a4b-be2f-64004c4c24b1"
                alt="Fioresque"
                width={99}
                height={28}
                className="h-6 w-auto md:h-7"
              />
            </Link>
            <p className="mt-3 max-w-[230px] text-[13px] leading-5 tracking-[0.03em] text-primary/80 md:mt-5 md:max-w-[260px] md:text-base md:leading-7 md:tracking-[0.04em]">
              Timeless clothing for everyone. Where nature and design meet.
            </p>
            <p className="mt-5 text-xs tracking-widest text-primary/80 md:mt-8 md:text-sm md:tracking-[0.12em]">STAY IN THE LOOP</p>
            <form className="mt-2 flex h-10 max-w-[280px] border border-primary/30 md:mt-3 md:h-11 md:max-w-[320px]">
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="w-full bg-transparent px-4 text-xs tracking-widest text-primary placeholder:text-primary/50 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary px-4 text-[10px] tracking-widest text-secondary transition hover:bg-primary/90"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3 md:gap-12">
            <nav className="space-y-2 text-[13px] tracking-[0.03em] md:space-y-4 md:text-base md:tracking-[0.04em]" aria-label="Shop">
              <p className="font-heading text-xs tracking-[0.12em] text-primary md:text-sm md:tracking-[0.14em]">SHOP</p>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                Hoodies
              </Link>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                Sweaters
              </Link>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                T-shirts
              </Link>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                View all
              </Link>
            </nav>

            <nav className="space-y-2 text-[13px] tracking-[0.03em] md:space-y-4 md:text-base md:tracking-[0.04em]" aria-label="Company">
              <p className="font-heading text-xs tracking-[0.12em] text-primary md:text-sm md:tracking-[0.14em]">COMPANY</p>
              <Link href="/over-ons" className="block text-primary/80 hover:text-primary">
                About us
              </Link>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                Collections
              </Link>
              <Link href="/shop" className="block text-primary/80 hover:text-primary">
                Lookbook
              </Link>
            </nav>

            <nav className="col-span-2 space-y-2 text-[13px] tracking-[0.03em] md:col-span-1 md:space-y-4 md:text-base md:tracking-[0.04em]" aria-label="Support">
              <p className="font-heading text-xs tracking-[0.12em] text-primary md:text-sm md:tracking-[0.14em]">SUPPORT</p>
              <Link href="#" className="block text-primary/80 hover:text-primary">
                Shipping & Returns
              </Link>
              <Link href="#" className="block text-primary/80 hover:text-primary">
                Size Guide
              </Link>
              <Link href="#" className="block text-primary/80 hover:text-primary">
                Contact
              </Link>
              <Link href="#" className="block text-primary/80 hover:text-primary">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
        <p className="mt-10 border-t border-primary/10 pt-5 text-center text-xs tracking-[0.06em] text-primary/60 md:mt-14 md:pt-6 md:text-sm">
          &copy; {new Date().getFullYear()} Fioresque Artwear
        </p>
      </div>
    </footer>
  );
}
