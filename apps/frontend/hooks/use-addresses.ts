"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
  type Address,
  type CreateAddressInput,
} from "@/lib/address-api";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export function useAddresses() {
  const { status } = useSession();

  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchAddresses();
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.addresses;
    },
    enabled: status === "authenticated",
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAddressInput) => {
      const result = await createAddress(input);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.address;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateAddressInput>;
    }) => {
      const result = await updateAddress(id, input);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.address;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAddress(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await setDefaultAddress(id);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      return result.data.address;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export type { Address };
