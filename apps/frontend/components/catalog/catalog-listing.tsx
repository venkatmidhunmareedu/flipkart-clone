import { Suspense } from "react";

import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { Pagination } from "@/components/catalog/pagination";
import { ProductGrid } from "@/components/catalog/product-grid";
import { SortSelect } from "@/components/catalog/sort-select";
import type { Category, Product } from "@/lib/api";

type CatalogListingProps = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories: Category[];
  brands: string[];
  basePath: string;
  title: string;
  fixedCategory?: string;
};

export function CatalogListing({
  products,
  total,
  page,
  totalPages,
  categories,
  brands,
  basePath,
  title,
  fixedCategory,
}: CatalogListingProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-[var(--text-primary,#212121)]">{title}</h1>
          <p className="text-sm text-[var(--text-secondary,#878787)]">
            Showing {products.length} of {total} results
            {page > 1 ? ` · Page ${page}` : ""}
          </p>
        </div>
        <Suspense fallback={null}>
          <SortSelect basePath={basePath} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Suspense fallback={null}>
          <FilterSidebar
            categories={categories}
            brands={brands}
            basePath={basePath}
            fixedCategory={fixedCategory}
          />
        </Suspense>

        <div className="min-w-0 flex-1">
          <ProductGrid products={products} />
          <Suspense fallback={null}>
            <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
