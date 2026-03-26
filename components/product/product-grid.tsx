import { ProductCard } from "./product-card";

export type ProductGridProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
};

type ProductGridProps = {
  products: ProductGridProduct[];
  priorityFirst?: number;
};

export function ProductGrid({ products, priorityFirst = 0 }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          id={p.id}
          title={p.title}
          price={p.price}
          imageUrl={p.imageUrl}
          priority={i < priorityFirst}
        />
      ))}
    </div>
  );
}
