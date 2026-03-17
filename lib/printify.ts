const PRINTIFY_BASE = "https://api.printify.com/v1";

function getHeaders(): HeadersInit {
  const key = process.env.PRINTIFY_API_KEY;
  if (!key) throw new Error("PRINTIFY_API_KEY is not set");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json;charset=utf-8",
    "User-Agent": "FioresqueArtwear/1.0",
  };
}

export type PrintifyProductListItem = {
  id: string;
  title: string;
  description: string;
  variants: Array<{
    id: number;
    title: string;
    options: Record<string, string>;
    is_available: boolean;
    price: number;
  }>;
  images: Array<{ src: string }>;
  created_at: string;
  updated_at: string;
  is_locked: boolean;
  blueprint_id: number;
  print_provider_id: number;
  sales_channel_properties: unknown[];
};

export type PrintifyProductsResponse = {
  current_page: number;
  data: PrintifyProductListItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export async function fetchPrintifyProducts(
  shopId: string,
  page = 1,
  limit = 100
): Promise<PrintifyProductsResponse> {
  const url = `${PRINTIFY_BASE}/shops/${shopId}/products.json?page=${page}&limit=${limit}`;
  const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<PrintifyProductsResponse>;
}

export async function fetchAllPrintifyProducts(shopId: string): Promise<PrintifyProductListItem[]> {
  const all: PrintifyProductListItem[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchPrintifyProducts(shopId, page, 100);
    all.push(...data.data);
    hasMore = data.current_page < data.last_page;
    page++;
    if (hasMore) await new Promise((r) => setTimeout(r, 700));
  }
  return all;
}

export async function fetchPrintifyProduct(
  shopId: string,
  productId: string
): Promise<PrintifyProductListItem | null> {
  const url = `${PRINTIFY_BASE}/shops/${shopId}/products/${productId}.json`;
  const res = await fetch(url, { headers: getHeaders(), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<PrintifyProductListItem>;
}
