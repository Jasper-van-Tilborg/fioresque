import type { ShopCategoryId, ShopProduct } from "@/lib/shop-product-mapper";

export type ShopSort = "newest" | "price-asc" | "price-desc" | "title-asc";

export type ShopListParams = {
  q: string;
  sort: ShopSort;
  categories: ShopCategoryId[];
  sizes: string[];
  colors: string[];
  minPrice: string;
  maxPrice: string;
  take: number;
};

const SORTS: ShopSort[] = ["newest", "price-asc", "price-desc", "title-asc"];
const CATEGORY_IDS: ShopCategoryId[] = ["hoodies", "sweaters", "t-shirts"];

function getParam(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

export function parseShopListParams(
  sp: Record<string, string | string[] | undefined>
): ShopListParams {
  const rawSort = getParam(sp, "sort");
  const sort: ShopSort = SORTS.includes(rawSort as ShopSort)
    ? (rawSort as ShopSort)
    : "newest";

  const catRaw = getParam(sp, "cat");
  const categories = (catRaw ? catRaw.split(",") : [])
    .filter((c): c is ShopCategoryId => CATEGORY_IDS.includes(c as ShopCategoryId));

  const sizeRaw = getParam(sp, "size");
  const sizes = sizeRaw ? sizeRaw.split(",").filter(Boolean) : [];

  const colorRaw = getParam(sp, "color");
  const colors = colorRaw ? colorRaw.split(",").filter(Boolean) : [];

  const takeRaw = getParam(sp, "take");
  const takeNum = Number(takeRaw);
  const take = Number.isFinite(takeNum) && takeNum >= 6 ? Math.min(takeNum, 10_000) : 6;

  return {
    q: (getParam(sp, "q") ?? "").trim(),
    sort,
    categories,
    sizes,
    colors,
    minPrice: getParam(sp, "min") ?? "",
    maxPrice: getParam(sp, "max") ?? "",
    take,
  };
}

export function countActiveFilters(p: ShopListParams): number {
  let n = p.categories.length + p.sizes.length + p.colors.length;
  if (p.minPrice.trim() !== "" || p.maxPrice.trim() !== "") n += 1;
  return n;
}

export function filterAndSortShopProducts(
  products: ShopProduct[],
  p: ShopListParams
): ShopProduct[] {
  const q = p.q.toLowerCase();
  let list = products.filter((x) => !q || x.title.toLowerCase().includes(q));

  if (p.categories.length > 0) {
    const set = new Set(p.categories);
    list = list.filter((x) => x.category != null && set.has(x.category));
  }
  if (p.sizes.length > 0) {
    const set = new Set(p.sizes);
    list = list.filter((x) => x.sizes.some((s) => set.has(s)));
  }
  if (p.colors.length > 0) {
    const set = new Set(p.colors);
    list = list.filter((x) => x.colorKeys.some((c) => set.has(c)));
  }

  const minEur = p.minPrice.trim() === "" ? null : Number(p.minPrice.replace(",", "."));
  const maxEur = p.maxPrice.trim() === "" ? null : Number(p.maxPrice.replace(",", "."));
  if (minEur != null && !Number.isNaN(minEur)) {
    const c = Math.round(minEur * 100);
    list = list.filter((x) => x.price >= c);
  }
  if (maxEur != null && !Number.isNaN(maxEur)) {
    const c = Math.round(maxEur * 100);
    list = list.filter((x) => x.price <= c);
  }

  const sorted = [...list];
  switch (p.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "nl"));
      break;
    case "newest":
    default:
      sorted.sort(
        (a, b) =>
          (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
      );
      break;
  }
  return sorted;
}

/** Bouwt querystring voor /shop (zonder leading ?) */
export function serializeShopListParams(p: ShopListParams): string {
  const u = new URLSearchParams();
  if (p.q) u.set("q", p.q);
  if (p.sort !== "newest") u.set("sort", p.sort);
  if (p.categories.length > 0) u.set("cat", p.categories.join(","));
  if (p.sizes.length > 0) u.set("size", p.sizes.join(","));
  if (p.colors.length > 0) u.set("color", p.colors.join(","));
  if (p.minPrice.trim() !== "") u.set("min", p.minPrice.trim());
  if (p.maxPrice.trim() !== "") u.set("max", p.maxPrice.trim());
  if (p.take > 6) u.set("take", String(p.take));
  return u.toString();
}

export function buildColorOptions(products: ShopProduct[]): { key: string; hex: string }[] {
  const map = new Map<string, string>();
  for (const p of products) {
    p.colorKeys.forEach((k, i) => {
      if (!map.has(k)) map.set(k, p.swatchHexes[i] ?? "#8a8580");
    });
  }
  return Array.from(map.entries()).map(([key, hex]) => ({ key, hex }));
}
