import type { PrintifyProductListItem } from "@/lib/printify";

export type ShopCategoryId = "hoodies" | "sweaters" | "t-shirts";

export type ShopProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  isNew: boolean;
  category: ShopCategoryId | null;
  sizes: string[];
  colorKeys: string[];
  swatchHexes: string[];
};

const NEW_DAYS = 90;

const COLOR_NAME_TO_HEX: Record<string, string> = {
  black: "#1a1a1a",
  white: "#faf9f6",
  off: "#f5f2eb",
  cream: "#f2efe8",
  grey: "#8a8580",
  gray: "#8a8580",
  navy: "#1e2d4a",
  blue: "#2d4a6f",
  red: "#8b2d2d",
  green: "#3d5c40",
  olive: "#5c6348",
  beige: "#c4b8a8",
  brown: "#5c4033",
  pink: "#c9a0a8",
  purple: "#5c4a6b",
  yellow: "#c4a84a",
  orange: "#c4783a",
};

function normalizeColorKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)[0] ?? raw;
}

function colorNameToHex(name: string): string {
  const key = normalizeColorKey(name);
  return COLOR_NAME_TO_HEX[key] ?? "#8a8580";
}

function inferCategory(title: string): ShopCategoryId | null {
  const t = title.toLowerCase();
  if (/\bhoodie\b/.test(t)) return "hoodies";
  if (/\b(sweater|crewneck|crew neck|pullover)\b/.test(t)) return "sweaters";
  if (/\b(sweatshirt)\b/.test(t) && !/\bhoodie\b/.test(t)) return "sweaters";
  if (/\b(t-?shirt|tshirt|tee|tank)\b/.test(t)) return "t-shirts";
  return null;
}

function parseVariantOptions(v: PrintifyProductListItem["variants"][0]): {
  color: string | null;
  size: string | null;
} {
  const options = v.options ?? {};
  let color: string | null = null;
  let size: string | null = null;
  for (const [k, val] of Object.entries(options)) {
    if (/color|colour|kleur/i.test(k)) color = String(val);
    if (/size|maat/i.test(k)) size = String(val).trim();
  }
  const title = v.title ?? "";
  if (!size) {
    const m = title.match(/\b(XS|S|M|L|XL|2XL|3XL)\b/i);
    if (m) size = m[1].toUpperCase();
  }
  if (!color && title.includes("/")) {
    const left = title.split("/")[0]?.trim();
    if (left && !/^(XS|S|M|L|XL|2XL|3XL)$/i.test(left)) color = left;
  }
  return { color, size };
}

function uniqueSizes(variants: PrintifyProductListItem["variants"]): string[] {
  const set = new Set<string>();
  for (const v of variants) {
    const { size } = parseVariantOptions(v);
    if (size) set.add(size);
  }
  return Array.from(set).sort((a, b) => {
    const order = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia >= 0 && ib >= 0) return ia - ib;
    return a.localeCompare(b);
  });
}

function uniqueColors(variants: PrintifyProductListItem["variants"]): {
  keys: string[];
  hexes: string[];
} {
  const map = new Map<string, string>();
  for (const v of variants) {
    const { color } = parseVariantOptions(v);
    if (!color) continue;
    const key = color.trim().toLowerCase();
    if (!map.has(key)) map.set(key, colorNameToHex(color));
  }
  const keys = Array.from(map.keys());
  const hexes = keys.map((k) => map.get(k)!);
  return { keys, hexes };
}

function isNewProduct(createdAt: string): boolean {
  const t = Date.parse(createdAt);
  if (Number.isNaN(t)) return false;
  const age = Date.now() - t;
  return age < NEW_DAYS * 24 * 60 * 60 * 1000;
}

export function mapPrintifyToShopProduct(p: PrintifyProductListItem): ShopProduct {
  const variants = p.variants ?? [];
  const price =
    variants.length > 0
      ? Math.min(...variants.map((v) => Math.round((v.price ?? 0) * 100)))
      : 0;
  const imageUrl = p.images?.length > 0 ? (p.images[0] as { src: string }).src : null;
  const { keys: colorKeys, hexes: swatchHexes } = uniqueColors(variants);
  const sizes = uniqueSizes(variants);

  return {
    id: p.id,
    title: p.title,
    price,
    imageUrl,
    createdAt: p.created_at,
    isNew: isNewProduct(p.created_at),
    category: inferCategory(p.title),
    sizes,
    colorKeys,
    swatchHexes,
  };
}
