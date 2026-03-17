import { getSupabase } from "@/lib/supabase";

export async function getHiddenProductIds(): Promise<Set<string>> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("hidden_products")
      .select("printify_product_id");
    if (!data || !Array.isArray(data)) return new Set();
    return new Set(
      data
        .map((r: { printify_product_id?: string }) => r.printify_product_id)
        .filter((id): id is string => Boolean(id))
    );
  } catch {
    return new Set();
  }
}

export async function isProductHidden(printifyProductId: string): Promise<boolean> {
  const set = await getHiddenProductIds();
  return set.has(printifyProductId);
}

export async function setProductVisibility(
  printifyProductId: string,
  hidden: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (hidden) {
    await supabase.from("hidden_products").upsert(
      { printify_product_id: printifyProductId },
      { onConflict: "printify_product_id" }
    );
  } else {
    await supabase
      .from("hidden_products")
      .delete()
      .eq("printify_product_id", printifyProductId);
  }
}

