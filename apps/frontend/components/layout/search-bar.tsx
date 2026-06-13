"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

type SearchBarProps = {
  className?: string;
  variant?: "inline" | "overlay";
  autoFocus?: boolean;
  onClose?: () => void;
};

export function SearchBar({
  className,
  variant = "inline",
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(query, 300);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const submit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      onClose?.();
    },
    [router, onClose],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(query);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.currentTarget.blur();
      onClose?.();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        variant === "overlay" ? "w-full" : "hidden min-w-0 flex-1 md:flex",
        className,
      )}
    >
      <div className="flex w-full overflow-hidden rounded-sm bg-white">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder="Search for Products, Brands and More"
          aria-label="Search products"
          className="min-w-0 flex-1 px-4 py-2.5 text-sm text-[var(--text-primary,#212121)] outline-none"
        />
        {variant === "overlay" && query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="flex items-center justify-center bg-white px-2 text-[var(--text-secondary,#878787)]"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center bg-white px-4 text-[var(--primary,#2874f0)]"
          aria-label="Search"
        >
          <Search className="size-5" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {debouncedQuery.trim() ? `Search query: ${debouncedQuery}` : "Search products"}
      </span>
    </form>
  );
}
