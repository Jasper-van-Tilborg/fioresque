"use client";

import { useMemo, useRef, useState } from "react";
import { ProductCard } from "./product-card";
import type { ProductGridProduct } from "./product-grid";

type MobileSummerCarouselProps = {
  products: ProductGridProduct[];
};

export function MobileSummerCarousel({ products }: MobileSummerCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleProducts = useMemo(() => products.slice(0, 3), [products]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || visibleProducts.length === 0) return;
    const cardWidth = container.firstElementChild instanceof HTMLElement
      ? container.firstElementChild.offsetWidth + 16
      : 1;
    const rawIndex = Math.round(container.scrollLeft / cardWidth);
    const nextIndex = Math.max(0, Math.min(visibleProducts.length - 1, rawIndex));
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  };

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden"
      >
        {visibleProducts.map((p, i) => (
          <div key={p.id} className="w-[259px] shrink-0 snap-start">
            <ProductCard
              id={p.id}
              title={p.title}
              price={p.price}
              imageUrl={p.imageUrl}
              priority={i === 0}
              isNew={p.isNew}
            />
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-1.5 md:hidden" aria-label="Carousel indicator">
        {visibleProducts.map((p, i) => (
          <span
            key={p.id}
            className={
              i === activeIndex
                ? "h-[5px] w-6 bg-secondary opacity-100 transition-all duration-300 ease-out motion-reduce:transition-none"
                : "h-[5px] w-3 bg-secondary/55 opacity-80 transition-all duration-300 ease-out motion-reduce:transition-none"
            }
            aria-hidden
          />
        ))}
      </div>
    </>
  );
}
