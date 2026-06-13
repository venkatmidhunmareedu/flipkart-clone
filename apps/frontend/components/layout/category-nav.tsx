import Link from "next/link";

import { CategoryIcon } from "@/components/icons/category-icons";
import type { Category } from "@/lib/api";
import { cn } from "@/lib/utils";

type CategoryNavProps = {
  categories: Category[];
  className?: string;
  activeSlug?: string;
};

export function CategoryNav({ categories, className, activeSlug }: CategoryNavProps) {
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
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = activeSlug === category.slug;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={cn(
                "flex min-w-[72px] flex-col items-center gap-1 rounded-sm px-2 py-1.5 text-center transition-colors hover:bg-[var(--surface,#f1f3f6)]",
                isActive && "border-b-2 border-[var(--primary,#2874f0)]",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-[var(--surface,#f1f3f6)] text-[var(--primary,#2874f0)]">
                <CategoryIcon slug={category.slug} className="size-7" />
              </div>
              <span className="max-w-[72px] truncate text-[11px] font-medium text-[var(--text-primary,#212121)]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
