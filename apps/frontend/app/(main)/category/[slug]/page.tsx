import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CatalogListing } from "@/components/catalog/catalog-listing";
import { applyClientFilters, extractBrands } from "@/lib/catalog-filters";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/api";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    rating?: string;
  }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryBySlug(slug);

  if (!result.ok) {
    return { title: "Category Not Found | Flipkart Clone" };
  }

  return {
    title: `${result.data.category.name} | Flipkart Clone`,
    description: `Shop ${result.data.category.name} products on Flipkart Clone`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const sort =
    (queryParams.sort as "relevance" | "price_asc" | "price_desc" | "rating" | "newest") ??
    "relevance";

  const categoryResult = await getCategoryBySlug(slug);
  if (!categoryResult.ok) {
    notFound();
  }

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({ category: slug, page, limit: 20, sort }),
    getCategories(),
  ]);

  const raw = productsResult.ok
    ? productsResult.data
    : { products: [], total: 0, page: 1, totalPages: 0 };

  const filtered = applyClientFilters(raw.products, {
    minPrice: queryParams.minPrice,
    maxPrice: queryParams.maxPrice,
    brand: queryParams.brand,
    rating: queryParams.rating,
  });

  const categories = categoriesResult.ok ? categoriesResult.data.categories : [];
  const brands = extractBrands(raw.products);

  return (
    <Suspense fallback={null}>
      <CatalogListing
        products={filtered}
        total={raw.total}
        page={raw.page}
        totalPages={raw.totalPages}
        categories={categories}
        brands={brands}
        basePath={`/category/${slug}`}
        title={categoryResult.data.category.name}
        fixedCategory={slug}
      />
    </Suspense>
  );
}
