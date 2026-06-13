import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogListing } from "@/components/catalog/catalog-listing";
import { applyClientFilters, extractBrands } from "@/lib/catalog-filters";
import { getCategories, getProducts } from "@/lib/api";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    rating?: string;
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();
  return {
    title: query ? `Search: ${query} | Flipkart Clone` : "Search Products | Flipkart Clone",
    description: query
      ? `Search results for "${query}" on Flipkart Clone`
      : "Search and discover products on Flipkart Clone",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(Number(params.page) || 1, 1);
  const sort = (params.sort as "relevance" | "price_asc" | "price_desc" | "rating" | "newest") ?? "relevance";

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      search: query || undefined,
      category: params.category,
      page,
      limit: 20,
      sort,
    }),
    getCategories(),
  ]);

  const raw = productsResult.ok
    ? productsResult.data
    : { products: [], total: 0, page: 1, totalPages: 0 };

  const filtered = applyClientFilters(raw.products, {
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    brand: params.brand,
    rating: params.rating,
  });

  const categories = categoriesResult.ok ? categoriesResult.data.categories : [];
  const brands = extractBrands(raw.products);
  const title = query ? `Results for "${query}"` : "All Products";

  return (
    <Suspense fallback={null}>
      <CatalogListing
        products={filtered}
        total={raw.total}
        page={raw.page}
        totalPages={raw.totalPages}
        categories={categories}
        brands={brands}
        basePath="/search"
        title={title}
      />
    </Suspense>
  );
}
