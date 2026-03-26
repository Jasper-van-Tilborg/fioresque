import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  priority?: boolean;
};

export function ProductCard({ id, title, price, imageUrl, priority }: ProductCardProps) {
  const priceEur = (price / 100).toFixed(2);

  return (
    <Link
      href={`/shop/${id}`}
      className="group block border border-primary/15 bg-secondary transition hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
    >
      <div className="relative border-b border-primary/10 bg-[#f2f0eb] pb-[100%]">
        <span className="absolute left-3 top-3 z-10 bg-primary px-3 py-1 font-heading text-[11px] tracking-[0.14em] text-secondary">
          NEW
        </span>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-primary/45">
            Geen afbeelding
          </div>
        )}
      </div>
      <div className="space-y-2 p-3 sm:p-5">
        <p className="text-[11px] tracking-[0.08em] text-primary/45 sm:text-xs">T-shirt</p>
        <h3 className="min-h-11 text-[13px] font-semibold leading-5 tracking-[0.02em] text-primary line-clamp-2 group-hover:text-primary/85 sm:min-h-12 sm:text-sm sm:leading-6">
          {title}
        </h3>
        <div className="flex min-h-6 items-end justify-between pt-1">
          <p className="text-[13px] leading-none text-primary/70 sm:text-sm">&euro; {priceEur}</p>
          <div className="flex items-center gap-1.5">
            <span className="size-3 border border-primary/35 bg-transparent" aria-hidden />
            <span className="size-3 bg-primary" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}
