"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/api";
import { cn } from "@/lib/utils";

type FilterSidebarProps = {
  categories: Category[];
  brands: string[];
  basePath: string;
  fixedCategory?: string;
  className?: string;
};

export function FilterSidebar({
  categories,
  brands,
  basePath,
  fixedCategory,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) ?? [],
  );
  const [minRating, setMinRating] = useState(searchParams.get("rating") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    fixedCategory ?? searchParams.get("category") ?? "",
  );

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${basePath}?${params.toString()}`);
      });
    },
    [basePath, router, searchParams],
  );

  function handleApply() {
    pushParams({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      brand: selectedBrands.length > 0 ? selectedBrands.join(",") : null,
      rating: minRating || null,
      category: fixedCategory ? null : selectedCategory || null,
    });
  }

  function handleClear() {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrands([]);
    setMinRating("");
    if (!fixedCategory) {
      setSelectedCategory("");
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brand");
    params.delete("rating");
    params.delete("page");
    if (!fixedCategory) {
      params.delete("category");
    }
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }

  const flatCategories = categories.flatMap((cat) => [
    cat,
    ...(cat.children ?? []),
  ]);

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 rounded-sm bg-white p-4 shadow-sm lg:block",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border,#e0e0e0)] pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          Clear All
        </button>
      </div>

      {!fixedCategory && flatCategories.length > 0 && (
        <fieldset className="mb-6">
          <legend className="mb-2 text-xs font-semibold uppercase text-[var(--text-secondary,#878787)]">
            Category
          </legend>
          <div className="space-y-2">
            {flatCategories.map((cat) => (
              <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => setSelectedCategory(cat.slug)}
                  className="accent-[var(--primary,#2874f0)]"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mb-6">
        <legend className="mb-2 text-xs font-semibold uppercase text-[var(--text-secondary,#878787)]">
          Price Range (₹)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded border border-[var(--border,#e0e0e0)] px-2 py-1.5 text-sm outline-none focus:border-[var(--primary,#2874f0)]"
          />
          <span className="text-[var(--text-secondary,#878787)]">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded border border-[var(--border,#e0e0e0)] px-2 py-1.5 text-sm outline-none focus:border-[var(--primary,#2874f0)]"
          />
        </div>
      </fieldset>

      {brands.length > 0 && (
        <fieldset className="mb-6">
          <legend className="mb-2 text-xs font-semibold uppercase text-[var(--text-secondary,#878787)]">
            Brand
          </legend>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-[var(--primary,#2874f0)]"
                />
                {brand}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mb-6">
        <legend className="mb-2 text-xs font-semibold uppercase text-[var(--text-secondary,#878787)]">
          Customer Ratings
        </legend>
        <div className="space-y-2">
          {[
            { value: "4", label: "4★ & above" },
            { value: "3", label: "3★ & above" },
            { value: "2", label: "2★ & above" },
          ].map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={minRating === option.value}
                onChange={() => setMinRating(option.value)}
                className="accent-[var(--primary,#2874f0)]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        type="button"
        onClick={handleApply}
        className="w-full rounded-sm bg-[var(--primary,#2874f0)] py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
      >
        Apply Filters
      </Button>
    </aside>
  );
}
