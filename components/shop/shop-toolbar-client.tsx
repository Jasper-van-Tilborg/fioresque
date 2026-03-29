"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { ShopCategoryId } from "@/lib/shop-product-mapper";
import {
  countActiveFilters,
  serializeShopListParams,
  type ShopListParams,
} from "@/lib/shop-query";

const CATEGORY_OPTIONS: { id: ShopCategoryId; label: string }[] = [
  { id: "hoodies", label: "Hoodies" },
  { id: "sweaters", label: "Sweaters" },
  { id: "t-shirts", label: "T-shirts" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"] as const;

const SORT_OPTIONS = [
  { value: "newest" as const, label: "Nieuwste eerst" },
  { value: "price-asc" as const, label: "Prijs: laag → hoog" },
  { value: "price-desc" as const, label: "Prijs: hoog → laag" },
  { value: "title-asc" as const, label: "Naam A–Z" },
];

type ColorOption = { key: string; hex: string };

type ShopToolbarClientProps = {
  listParams: ShopListParams;
  colorOptions: ColorOption[];
};

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ShopToolbarClient({ listParams, colorOptions }: ShopToolbarClientProps) {
  const router = useRouter();
  const mounted = useIsClient();
  const activeFilterCount = countActiveFilters(listParams);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterClosing, setFilterClosing] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [draftCategories, setDraftCategories] = useState<Set<ShopCategoryId>>(new Set());
  const [draftSizes, setDraftSizes] = useState<Set<string>>(new Set());
  const [draftColors, setDraftColors] = useState<Set<string>>(new Set());
  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");

  const openFilter = () => {
    setDraftCategories(new Set(listParams.categories));
    setDraftSizes(new Set(listParams.sizes));
    setDraftColors(new Set(listParams.colors));
    setDraftMin(listParams.minPrice);
    setDraftMax(listParams.maxPrice);
    setFilterClosing(false);
    setFilterOpen(true);
  };

  const closeFilter = () => {
    if (!filterOpen || filterClosing) return;
    setFilterClosing(true);
  };

  useEffect(() => {
    if (!filterClosing) return;
    const t = setTimeout(() => {
      setFilterOpen(false);
      setFilterClosing(false);
    }, 280);
    return () => clearTimeout(t);
  }, [filterClosing]);

  useEffect(() => {
    if (!filterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [sortOpen]);

  const applyFilters = useCallback(() => {
    const next: ShopListParams = {
      ...listParams,
      categories: Array.from(draftCategories),
      sizes: Array.from(draftSizes),
      colors: Array.from(draftColors),
      minPrice: draftMin,
      maxPrice: draftMax,
      take: 6,
    };
    router.push(`/shop?${serializeShopListParams(next)}`);
    setFilterClosing(true);
  }, [
    listParams,
    draftCategories,
    draftSizes,
    draftColors,
    draftMin,
    draftMax,
    router,
  ]);

  const pushSort = (sort: ShopListParams["sort"]) => {
    router.push(
      `/shop?${serializeShopListParams({ ...listParams, sort, take: 6 })}`
    );
    setSortOpen(false);
  };

  const toggleDraftCategory = (id: ShopCategoryId) => {
    setDraftCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDraftSize = (s: string) => {
    setDraftSizes((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const toggleDraftColor = (key: string) => {
    setDraftColors((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const sheet = mounted && filterOpen && createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Sluit filters"
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out"
        style={{ opacity: filterClosing ? 0 : 1 }}
        onClick={closeFilter}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className={`relative max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-primary/10 bg-secondary shadow-[0_-8px_40px_rgba(48,45,46,0.12)] ${
          filterClosing ? "bottom-sheet-exit" : "bottom-sheet-enter"
        }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <span className="h-1 w-10 rounded-full bg-primary/20" aria-hidden />
        </div>
        <div className="px-5 pb-6 pt-1">
          <h2 id="filter-sheet-title" className="sr-only">
            Filters
          </h2>

          <p className="font-heading text-[11px] tracking-[0.14em] text-primary/55">Categorie</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map(({ id, label }) => {
              const on = draftCategories.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleDraftCategory(id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition ${
                    on
                      ? "border-primary bg-primary text-secondary"
                      : "border-primary/25 bg-transparent text-primary hover:border-primary/45"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-heading text-[11px] tracking-[0.14em] text-primary/55">Maat</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((s) => {
              const on = draftSizes.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleDraftSize(s)}
                  className={`flex size-10 items-center justify-center border text-[12px] font-medium transition ${
                    on
                      ? "border-primary bg-primary text-secondary"
                      : "border-primary/25 text-primary hover:border-primary/45"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-heading text-[11px] tracking-[0.14em] text-primary/55">Kleur</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {colorOptions.length === 0 ? (
              <p className="text-[12px] text-primary/45">Geen kleuren beschikbaar</p>
            ) : (
              colorOptions.map(({ key, hex }) => {
                const on = draftColors.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    title={key}
                    onClick={() => toggleDraftColor(key)}
                    className={`relative flex size-9 items-center justify-center rounded-full border-2 transition ${
                      on ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <span
                      className="size-7 rounded-full border border-primary/15 shadow-inner"
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })
            )}
          </div>

          <p className="mt-6 font-heading text-[11px] tracking-[0.14em] text-primary/55">Prijs (€)</p>
          <div className="mt-2 flex items-center gap-3">
            <label className="sr-only" htmlFor="filter-min">
              Minimum
            </label>
            <input
              id="filter-min"
              type="number"
              min={0}
              step={1}
              placeholder="Min"
              value={draftMin}
              onChange={(e) => setDraftMin(e.target.value)}
              className="min-h-11 w-full border border-primary/20 bg-secondary px-3 text-[13px] text-primary placeholder:text-primary/35"
            />
            <span className="text-primary/35">—</span>
            <label className="sr-only" htmlFor="filter-max">
              Maximum
            </label>
            <input
              id="filter-max"
              type="number"
              min={0}
              step={1}
              placeholder="Max"
              value={draftMax}
              onChange={(e) => setDraftMax(e.target.value)}
              className="min-h-11 w-full border border-primary/20 bg-secondary px-3 text-[13px] text-primary placeholder:text-primary/35"
            />
          </div>

          <div className="sticky bottom-0 mt-8 bg-secondary pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full rounded-none font-heading text-[13px] tracking-[0.1em] text-secondary"
              onClick={applyFilters}
            >
              Toon resultaten
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={openFilter}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-secondary/25 bg-secondary/5 px-4 text-[12px] font-medium tracking-[0.06em] text-secondary transition hover:border-secondary/45 hover:bg-secondary/10 md:flex-none md:min-w-[140px]"
        >
          <FilterIcon className="text-secondary/90" />
          <span>Filter</span>
          {activeFilterCount > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-primary">
              {activeFilterCount}
            </span>
          ) : null}
        </button>

        <div ref={sortRef} className="relative flex-1 md:max-w-[200px]">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            aria-expanded={sortOpen}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-secondary/25 bg-secondary/5 px-4 text-[12px] font-medium tracking-[0.06em] text-secondary transition hover:border-secondary/45 hover:bg-secondary/10"
          >
            <span>Sorteren</span>
            <ChevronDownIcon
              className={`text-secondary/80 transition ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {sortOpen ? (
            <ul
              className="absolute right-0 z-20 mt-1 w-full min-w-[200px] border border-primary/10 bg-secondary py-1 shadow-lg"
              role="listbox"
            >
              {SORT_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={listParams.sort === opt.value}
                    className={`w-full px-4 py-2.5 text-left text-[12px] ${
                      listParams.sort === opt.value
                        ? "bg-primary/5 font-semibold text-primary"
                        : "text-primary/85 hover:bg-primary/5"
                    }`}
                    onClick={() => pushSort(opt.value)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {sheet}
    </>
  );
}
