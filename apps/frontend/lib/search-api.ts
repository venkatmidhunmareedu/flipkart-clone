import type { Product } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export async function fetchSearchSuggestions(
  query: string,
  limit = 8,
  signal?: AbortSignal,
): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const params = new URLSearchParams({
    search: trimmed,
    limit: String(limit),
  });

  try {
    const response = await fetch(`${API_URL}/api/products?${params}`, {
      signal,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    let json: ApiSuccess<{ products: Product[] }> | ApiError;
    try {
      json = (await response.json()) as ApiSuccess<{ products: Product[] }> | ApiError;
    } catch {
      return [];
    }

    if ("error" in json) {
      return [];
    }

    return json.data.products;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return [];
    }
    return [];
  }
}
