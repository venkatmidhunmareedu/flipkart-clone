"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SearchMagnifierIcon } from "@/components/icons/flipkart-icons";
import { SearchSuggestions } from "@/components/layout/search-suggestions";
import type { Product } from "@/lib/api";
import { fetchSearchSuggestions } from "@/lib/search-api";
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
  variant?: "blue" | "white";
  layout?: "inline" | "overlay" | "header";
  autoFocus?: boolean;
  onClose?: () => void;
};

export function SearchBar({
  className,
  variant = "white",
  layout = "inline",
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
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
      setIsFocused(false);
      setActiveIndex(-1);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      onClose?.();
    },
    [router, onClose],
  );

  const selectSuggestion = useCallback(
    (product: Product) => {
      submit(product.title);
    },
    [submit],
  );

  const closeDropdown = useCallback(() => {
    setIsFocused(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!isFocused || trimmed.length < 1) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchSearchSuggestions(trimmed, 8, controller.signal)
      .then((products) => {
        if (!controller.signal.aborted) {
          setSuggestions(products);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort("query-changed");
  }, [debouncedQuery, isFocused]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }
    submit(query);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      event.currentTarget.blur();
      onClose?.();
      return;
    }

    if (!showDropdown || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }
  }

  const isBlue = variant === "blue";
  const isHeader = layout === "header";
  const showDropdown = isFocused && query.trim().length >= 1;

  return (
    <div
      ref={containerRef}
      className={cn(
        layout === "overlay" ? "w-full" : "hidden min-w-0 flex-1 md:flex",
        isHeader && "flex w-full",
        "relative",
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={cn(
            "relative flex w-full items-center overflow-hidden bg-white transition-shadow",
            isHeader
              ? cn(
                  "rounded-full border px-4 py-2 shadow-sm",
                  isFocused
                    ? "border-[var(--primary,#2874f0)] shadow-[0_0_0_1px_var(--primary,#2874f0)]"
                    : "border-[var(--border,#e0e0e0)]",
                )
              : cn(
                  "rounded-sm shadow-sm",
                  isBlue ? "bg-white" : "border border-[var(--primary,#2874f0)]/30 bg-white",
                  isFocused && !isBlue && "border-[var(--primary,#2874f0)]",
                ),
          )}
        >
          {(isHeader || layout === "overlay") && (
            <SearchMagnifierIcon className="mr-2 size-[18px] shrink-0 text-[var(--text-secondary,#878787)]" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              window.setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                }
              }, 150);
            }}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder="Search for Products, Brands and More"
            aria-label="Search products"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls={showDropdown ? "search-suggestions" : undefined}
            role="combobox"
            className={cn(
              "min-w-0 flex-1 text-sm text-[var(--text-primary,#212121)] outline-none placeholder:text-[var(--text-secondary,#878787)]",
              isHeader || layout === "overlay" ? "bg-transparent py-0.5" : "px-4 py-2.5",
            )}
          />
          {layout === "overlay" && query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="flex items-center justify-center bg-white px-2 text-[var(--text-secondary,#878787)]"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          {!isHeader && layout !== "overlay" && (
            <button
              type="submit"
              className="flex items-center justify-center bg-white px-4 text-[var(--primary,#2874f0)]"
              aria-label="Search"
            >
              <SearchMagnifierIcon className="size-5" />
            </button>
          )}
        </div>
      </form>

      {showDropdown ? (
        <div id="search-suggestions">
          <SearchSuggestions
            query={query}
            suggestions={suggestions}
            activeIndex={activeIndex}
            isLoading={isLoading}
            onSelect={selectSuggestion}
            onHover={setActiveIndex}
          />
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {debouncedQuery.trim() ? `Search query: ${debouncedQuery}` : "Search products"}
      </span>
    </div>
  );
}
