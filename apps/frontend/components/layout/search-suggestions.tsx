"use client";

import Image from "next/image";

import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type SearchSuggestionsProps = {
  query: string;
  suggestions: Product[];
  activeIndex: number;
  isLoading: boolean;
  onSelect: (product: Product) => void;
  onHover: (index: number) => void;
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) {
    return <>{text}</>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <strong className="font-semibold text-[var(--text-primary,#212121)]">
        {text.slice(index, index + trimmed.length)}
      </strong>
      {text.slice(index + trimmed.length)}
    </>
  );
}

function formatCategoryHint(categoryName?: string): string | null {
  if (!categoryName) {
    return null;
  }
  return `in ${categoryName}`;
}

export function SearchSuggestions({
  query,
  suggestions,
  activeIndex,
  isLoading,
  onSelect,
  onHover,
}: SearchSuggestionsProps) {
  if (!query.trim()) {
    return null;
  }

  return (
    <div
      role="listbox"
      aria-label="Search suggestions"
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-y-auto rounded-md bg-white py-1 shadow-lg"
    >
      {isLoading && suggestions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-[var(--text-secondary,#878787)]">
          Searching…
        </div>
      ) : null}

      {!isLoading && suggestions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-[var(--text-secondary,#878787)]">
          No results for &ldquo;{query.trim()}&rdquo;
        </div>
      ) : null}

      {suggestions.map((product, index) => {
        const image = product.images[0] ?? "/placeholder-product.png";
        const categoryHint = formatCategoryHint(product.category?.name);

        return (
          <button
            key={product.id}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(product)}
            onMouseEnter={() => onHover(index)}
            className={cn(
              "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--surface,#f1f3f6)]",
              index === activeIndex && "bg-[var(--surface,#f1f3f6)]",
            )}
          >
            <div className="relative size-9 shrink-0 overflow-hidden rounded bg-[#f5f5f5]">
              <Image
                src={image}
                alt=""
                fill
                sizes="36px"
                className="object-contain p-0.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-[var(--text-primary,#212121)]">
                <HighlightMatch text={product.title} query={query} />
              </p>
              {categoryHint ? (
                <p className="mt-0.5 text-xs text-[var(--primary,#2874f0)]">
                  {categoryHint}
                </p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
