"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
] as const;

type SortSelectProps = {
  basePath: string;
  className?: string;
};

export function SortSelect({ basePath, className }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") ?? "relevance";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-[var(--text-secondary,#878787)]">Sort By</span>
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text-primary,#212121)] outline-none focus:border-[var(--primary,#2874f0)]"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
