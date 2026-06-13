import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { CategoryIcon } from "@/components/icons/category-icons";
import type { Category } from "@/lib/api";
import { cn } from "@/lib/utils";

const HOME_NAV_ITEMS = [
  { label: "For You", slug: null },
  { label: "Fashion", slug: "fashion" },
  { label: "Mobiles", slug: "mobiles" },
  { label: "Beauty", slug: "beauty" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home", slug: "home" },
  { label: "Appliances", slug: "appliances" },
  { label: "Toys, ba...", slug: "toys-baby" },
  { label: "Food & H...", slug: "food-health" },
  { label: "Auto Acc...", slug: null },
  { label: "2 Wheele...", slug: null },
  { label: "Sports & ...", slug: "sports" },
  { label: "Books & ...", slug: null },
  { label: "Furniture", slug: "furniture" },
];

const TEXT_NAV_ITEMS = [
  "Electronics",
  "TVs & Appliances",
  "Men",
  "Women",
  "Baby & Kids",
  "Home & Furniture",
  "Sports",
  "Books & More",
  "Flights",
  "Offer Zone",
  "Grocery",
];

type CategoryNavProps = {
  categories: Category[];
  className?: string;
  activeSlug?: string;
  variant?: "icons" | "text" | "home";
};

export function CategoryNav({
  categories,
  className,
  activeSlug,
  variant = "icons",
}: CategoryNavProps) {
  if (variant === "home") {
    return (
      <nav
        className={cn("hidden border-b border-[var(--border,#e0e0e0)] bg-white md:block", className)}
        aria-label="Categories"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-center gap-0 overflow-x-auto px-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HOME_NAV_ITEMS.map((item, index) => {
              const isActive = item.slug === null ? index === 0 && !activeSlug : activeSlug === item.slug;
              const content = (
                <span
                  className={cn(
                    "relative block whitespace-nowrap px-3 py-2.5 text-[13px] font-medium",
                    isActive
                      ? "text-[var(--primary,#2874f0)] after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t after:bg-[var(--primary,#2874f0)]"
                      : "text-[var(--text-primary,#212121)] hover:text-[var(--primary,#2874f0)]",
                  )}
                >
                  {item.label}
                </span>
              );

              if (item.slug) {
                return (
                  <Link key={item.label} href={`/category/${item.slug}`} className="shrink-0">
                    {content}
                  </Link>
                );
              }

              return (
                <span key={item.label} className="shrink-0 cursor-default">
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "text") {
    return (
      <nav
        className={cn(
          "hidden border-b border-[var(--border,#e0e0e0)] bg-white md:block",
          className,
        )}
        aria-label="Categories"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-4 py-2.5 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEXT_NAV_ITEMS.map((item) => (
            <span
              key={item}
              className="flex shrink-0 cursor-default items-center gap-0.5 px-3 py-1 font-medium text-[var(--text-primary,#212121)] hover:text-[var(--primary,#2874f0)]"
            >
              {item}
              {(item === "Electronics" || item === "Men" || item === "Women") && (
                <ChevronDown className="size-3 text-[var(--text-secondary,#878787)]" />
              )}
            </span>
          ))}
        </div>
      </nav>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "hidden border-b border-[var(--border,#e0e0e0)] bg-white shadow-sm md:block",
        className,
      )}
      aria-label="Categories"
    >
      <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category, index) => {
          const isActive = activeSlug === category.slug || (index === 0 && !activeSlug);

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={cn(
                "relative flex min-w-[76px] flex-col items-center gap-1 px-2 py-2 text-center transition-colors",
                isActive && "after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:bg-[var(--primary,#2874f0)]",
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center text-[var(--primary,#2874f0)]",
                  isActive && "text-[var(--primary,#2874f0)]",
                )}
              >
                <CategoryIcon slug={category.slug} className="size-7" />
              </div>
              <span
                className={cn(
                  "max-w-[76px] truncate text-[11px] font-medium",
                  isActive
                    ? "text-[var(--primary,#2874f0)]"
                    : "text-[var(--text-primary,#212121)]",
                )}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
