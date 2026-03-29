import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  priority?: boolean;
  /** Alleen tonen wanneer product als nieuw is gemarkeerd */
  isNew?: boolean;
  /** Shop: compacte typografie, vierkante foto, swatches naast prijs */
  variant?: "default" | "shop";
  /** Hex-kleuren voor swatches (max. ~4 zichtbaar) */
  swatches?: string[];
};

export function ProductCard({
  id,
  title,
  price,
  imageUrl,
  priority,
  isNew = false,
  variant = "default",
  swatches = [],
}: ProductCardProps) {
  const priceEur = (price / 100).toFixed(2);
  const isShop = variant === "shop";
  const displaySwatches = swatches.slice(0, 4);

  return (
    <Link
      href={`/shop/${id}`}
      className={`group block bg-secondary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary ${
        isShop
          ? "border border-primary/10 hover:border-primary/25"
          : "border border-primary/15 hover:border-primary/30"
      }`}
    >
      <div
        className={`relative overflow-hidden border-b border-primary/10 bg-[#f2f0eb] ${
          isShop ? "aspect-square" : "pb-[100%]"
        }`}
      >
        {isNew ? (
          <span className="absolute left-2 top-2 z-10 bg-primary px-2 py-0.5 font-heading text-[9px] tracking-[0.12em] text-secondary">
            NEW
          </span>
        ) : null}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-contain transition duration-300 group-hover:scale-[1.02] ${
              isShop ? "p-4" : "p-6"
            }`}
            sizes={
              isShop
                ? "(max-width: 640px) 50vw, 25vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-primary/45">
            Geen afbeelding
          </div>
        )}
      </div>
      <div className={isShop ? "p-2.5 pt-2" : "space-y-2 p-3 sm:p-5"}>
        {!isShop ? (
          <p className="text-[11px] tracking-[0.08em] text-primary/45 sm:text-xs">T-shirt</p>
        ) : null}
        <h3
          className={
            isShop
              ? "line-clamp-2 min-h-10 text-[12px] font-semibold leading-[1.35] tracking-[0.02em] text-primary group-hover:text-primary/85"
              : "min-h-11 text-[13px] font-semibold leading-5 tracking-[0.02em] text-primary line-clamp-2 group-hover:text-primary/85 sm:min-h-12 sm:text-sm sm:leading-6"
          }
        >
          {title}
        </h3>
        <div
          className={`flex items-end justify-between pt-1 ${
            isShop ? "min-h-[18px] gap-2" : "min-h-6"
          }`}
        >
          <p
            className={
              isShop
                ? "shrink-0 text-[12px] leading-none text-primary/80"
                : "text-[13px] leading-none text-primary/70 sm:text-sm"
            }
          >
            &euro; {priceEur}
          </p>
          {isShop && displaySwatches.length > 0 ? (
            <div className="flex shrink-0 items-center gap-1" aria-hidden>
              {displaySwatches.map((hex, i) => (
                <span
                  key={`${hex}-${i}`}
                  className="size-2.5 shrink-0 rounded-full border border-primary/20"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          ) : !isShop ? (
            <div className="flex items-center gap-1.5">
              <span className="size-3 border border-primary/35 bg-transparent" aria-hidden />
              <span className="size-3 bg-primary" aria-hidden />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
