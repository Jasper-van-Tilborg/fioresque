"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ShopFiltersProps = { categories: string[] };

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/shop?${next.toString()}`);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-primary/10 bg-secondary/50 p-4">
      {categories.length > 0 && (
        <div>
          <label htmlFor="category" className="mr-2 text-sm font-medium text-primary">
            Categorie
          </label>
          <select
            id="category"
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateFilter("category", e.target.value || null)}
            className="rounded border border-primary/20 bg-secondary px-3 py-1.5 text-primary"
          >
            <option value="">Alle</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <label htmlFor="minPrice" className="text-sm font-medium text-primary">
          Min. prijs (€)
        </label>
        <input
          id="minPrice"
          type="number"
          min={0}
          step={1}
          placeholder="0"
          defaultValue={searchParams.get("minPrice") ?? ""}
          onBlur={(e) => {
            const v = e.target.value;
            updateFilter("minPrice", v ? String(Math.max(0, Number(v))) : null);
          }}
          className="w-20 rounded border border-primary/20 bg-secondary px-2 py-1.5 text-primary"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="maxPrice" className="text-sm font-medium text-primary">
          Max. prijs (€)
        </label>
        <input
          id="maxPrice"
          type="number"
          min={0}
          step={1}
          placeholder="—"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) => {
            const v = e.target.value;
            updateFilter("maxPrice", v ? String(Math.max(0, Number(v))) : null);
          }}
          className="w-20 rounded border border-primary/20 bg-secondary px-2 py-1.5 text-primary"
        />
      </div>
    </div>
  );
}
