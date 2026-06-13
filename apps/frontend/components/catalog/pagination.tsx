"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
};

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1 py-6", className)}
    >
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary,#2874f0)] hover:bg-[var(--surface,#f1f3f6)]"
        >
          Previous
        </Link>
      )}

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[var(--text-secondary,#878787)]">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "min-w-9 rounded-sm border px-3 py-1.5 text-center text-sm font-medium",
              page === currentPage
                ? "border-[var(--primary,#2874f0)] bg-[var(--primary,#2874f0)] text-white"
                : "border-[var(--border,#e0e0e0)] bg-white text-[var(--text-primary,#212121)] hover:bg-[var(--surface,#f1f3f6)]",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary,#2874f0)] hover:bg-[var(--surface,#f1f3f6)]"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
