import { PackageOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  className?: string;
};

function ProductCardSkeleton() {
  return (
    <div className="rounded-sm bg-white p-3 shadow-sm">
      <Skeleton className="mx-auto mb-3 aspect-square w-full max-w-[180px]" />
      <Skeleton className="mb-2 h-4 w-16" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-3 h-4 w-3/4" />
      <Skeleton className="h-5 w-24" />
    </div>
  );
}

export function ProductGrid({ products, loading, className }: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
          className,
        )}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm bg-white px-6 py-16 text-center shadow-sm">
        <PackageOpen className="mb-4 size-12 text-[var(--text-secondary,#878787)]" />
        <h3 className="text-lg font-medium text-[var(--text-primary,#212121)]">
          No products found
        </h3>
        <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary,#878787)]">
          Try adjusting your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
