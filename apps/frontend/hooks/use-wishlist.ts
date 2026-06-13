"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  addToWishlist,
  fetchWishlist,
  fetchWishlistIds,
  removeFromWishlist,
  type WishlistItem,
} from "@/lib/wishlist-api";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;
export const WISHLIST_IDS_QUERY_KEY = ["wishlist-ids"] as const;

export function useWishlistIds() {
  const { status } = useSession();

  return useQuery({
    queryKey: WISHLIST_IDS_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchWishlistIds();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return new Set(result.data.productIds);
    },
    enabled: status === "authenticated",
  });
}

export function useWishlist() {
  const { status } = useSession();

  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchWishlist();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.items;
    },
    enabled: status === "authenticated",
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      isInWishlist,
    }: {
      productId: string;
      isInWishlist: boolean;
    }) => {
      const result = isInWishlist
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onMutate: async ({ productId, isInWishlist }) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_IDS_QUERY_KEY });

      const previous = queryClient.getQueryData<Set<string>>(WISHLIST_IDS_QUERY_KEY);
      const next = new Set(previous ?? []);

      if (isInWishlist) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      queryClient.setQueryData(WISHLIST_IDS_QUERY_KEY, next);

      return { previous };
    },
    onSuccess: (_data, { isInWishlist }) => {
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WISHLIST_IDS_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await addToWishlist(productId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.item;
    },
    onSuccess: () => {
      toast.success("Added to wishlist");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}

export type { WishlistItem };
