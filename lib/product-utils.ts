export type ProductVariant = {
  id: number;
  title: string;
  price: number;
};

export function parseVariants(json: unknown): ProductVariant[] {
  if (!Array.isArray(json)) return [];
  return json
    .filter(
      (v): v is { id: number; title: string; price: number } =>
        v != null && typeof v === "object" && "id" in v && "title" in v
    )
    .map((v) => ({
      id: Number(v.id),
      title: String(v.title),
      price: Number(v.price) ?? 0,
    }));
}
