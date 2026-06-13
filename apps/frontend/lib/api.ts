const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: ApiError["error"] }> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: options?.next ?? { revalidate: 60 },
  });

  let json: ApiSuccess<T> | ApiError;
  try {
    json = (await response.json()) as ApiSuccess<T> | ApiError;
  } catch {
    return {
      ok: false,
      error: { message: "Invalid response from server", code: "PARSE_ERROR" },
    };
  }

  if (!response.ok || "error" in json) {
    return {
      ok: false,
      error: "error" in json ? json.error : { message: "Request failed", code: "UNKNOWN" },
    };
  }

  return { ok: true, data: json.data };
}

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  images: string[];
  categoryId: string;
  category?: ProductCategory;
  mrp: number;
  sellingPrice: number;
  mrpPaise: number;
  sellingPricePaise: number;
  discountPercent: number;
  inStock: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isAssured: boolean;
  attributes: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  parentId: string | null;
  children?: Category[];
};

export type BreadcrumbItem = {
  id: string;
  name: string;
  slug: string;
};

export type ProductsResult = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

export type GetProductsParams = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "relevance" | "price_asc" | "price_desc" | "rating" | "newest";
};

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(params: GetProductsParams = {}) {
  const query = buildQuery({
    category: params.category,
    search: params.search,
    page: params.page,
    limit: params.limit,
    sort: params.sort,
  });
  return apiFetch<ProductsResult>(`/api/products${query}`);
}

export async function getFeaturedProducts(limit = 12) {
  return apiFetch<{ products: Product[] }>(`/api/products/featured${buildQuery({ limit })}`);
}

export async function getProductBySlug(slug: string) {
  return apiFetch<{ product: Product; breadcrumb: BreadcrumbItem[] }>(`/api/products/${slug}`);
}

export async function getSimilarProducts(slug: string, limit = 8) {
  return apiFetch<{ products: Product[] }>(
    `/api/products/${slug}/similar${buildQuery({ limit })}`,
  );
}

export async function getCategories() {
  return apiFetch<{ categories: Category[] }>("/api/categories");
}

export async function getCategoryBySlug(slug: string) {
  return apiFetch<{ category: Category; breadcrumb: BreadcrumbItem[] }>(
    `/api/categories/${slug}`,
  );
}
