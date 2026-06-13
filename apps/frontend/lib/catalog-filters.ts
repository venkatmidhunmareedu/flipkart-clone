import type { Product } from "@/lib/api";

type FilterParams = {
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  rating?: string;
};

export function applyClientFilters(products: Product[], params: FilterParams): Product[] {
  let filtered = products;

  const min = params.minPrice ? Number(params.minPrice) : undefined;
  const max = params.maxPrice ? Number(params.maxPrice) : undefined;

  if (min !== undefined && !Number.isNaN(min)) {
    filtered = filtered.filter((p) => p.sellingPrice >= min);
  }
  if (max !== undefined && !Number.isNaN(max)) {
    filtered = filtered.filter((p) => p.sellingPrice <= max);
  }

  if (params.brand) {
    const brands = params.brand.split(",").filter(Boolean);
    if (brands.length > 0) {
      filtered = filtered.filter((p) => brands.includes(p.brand));
    }
  }

  if (params.rating) {
    const minRating = Number(params.rating);
    if (!Number.isNaN(minRating)) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }
  }

  return filtered;
}

export function extractBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}
