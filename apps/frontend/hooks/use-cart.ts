"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateQuantity,
  type CartData,
} from "@/lib/cart-api";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCart() {
  const { status } = useSession();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchCart();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: status === "authenticated",
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const result = await addToCart(productId, quantity);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useUpdateQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const result = await updateQuantity(productId, quantity);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previous = queryClient.getQueryData<CartData>(CART_QUERY_KEY);

      if (previous) {
        queryClient.setQueryData<CartData>(CART_QUERY_KEY, {
          ...previous,
          items: previous.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      }

      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await removeFromCart(productId);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Removed from cart");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
