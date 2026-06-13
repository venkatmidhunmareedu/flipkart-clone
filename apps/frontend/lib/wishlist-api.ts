import { getSession } from "next-auth/react";

import type { Product } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiSuccess<T> = { data: T };
type ApiError = { error: { message: string; code: string } };

export type WishlistItem = {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
};

async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

async function wishlistFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: ApiError["error"] }> {
  const token = await getAccessToken();

  if (!token) {
    return {
      ok: false,
      error: { message: "Unauthorized", code: "UNAUTHORIZED" },
    };
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
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

export async function fetchWishlist() {
  return wishlistFetch<{ items: WishlistItem[] }>("/api/wishlist");
}

export async function fetchWishlistIds() {
  return wishlistFetch<{ productIds: string[] }>("/api/wishlist/ids");
}

export async function addToWishlist(productId: string) {
  return wishlistFetch<{ item: WishlistItem }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string) {
  return wishlistFetch<{ removed: boolean; productId: string }>(
    `/api/wishlist/${productId}`,
    { method: "DELETE" },
  );
}
