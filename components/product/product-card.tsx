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
      className="group block overflow-hidden rounded-lg border border-primary/10 bg-secondary transition hover:border-primary/20 hover:shadow-md"
    >
      <div className="relative aspect-square bg-primary/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            Geen afbeelding
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-extrabold text-primary line-clamp-2 group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-1 text-lg font-semibold text-primary">&euro; {priceEur}</p>
      </div>
    </Link>
  );
}
