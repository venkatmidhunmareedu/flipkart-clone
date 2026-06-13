"use client";

import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";

import { AddressForm } from "@/components/checkout/address-form";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
  type Address,
} from "@/hooks/use-addresses";
import type { CreateAddressInput } from "@/lib/address-api";

type AddressCardProps = {
  address: Address;
  isLast: boolean;
};

function AddressCard({ address, isLast }: AddressCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const updateAddress = useUpdateAddress();

  async function handleDelete() {
    if (!window.confirm("Delete this address?")) return;
    await deleteAddress.mutateAsync(address.id);
    setMenuOpen(false);
  }

  async function handleSetDefault() {
    await setDefault.mutateAsync(address.id);
    setMenuOpen(false);
  }

  async function handleUpdate(input: CreateAddressInput) {
    await updateAddress.mutateAsync({ id: address.id, input });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="px-4 py-4">
        <AddressForm
          initialValues={{
            name: address.name,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2 ?? "",
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            type: address.type,
          }}
          onSubmit={handleUpdate}
          submitLabel="Update Address"
          isSubmitting={updateAddress.isPending}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className={`relative px-4 py-4 ${!isLast ? "border-b border-[var(--border,#e0e0e0)]" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-sm bg-[var(--surface,#f1f3f6)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--text-secondary,#878787)]">
          {address.type}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded p-1 hover:bg-[var(--surface,#f1f3f6)]"
            aria-label="Address options"
          >
            <MoreVertical className="size-4 text-[var(--text-secondary,#878787)]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-40 rounded-sm border border-[var(--border,#e0e0e0)] bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-[var(--surface,#f1f3f6)]"
              >
                Edit
              </button>
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => void handleSetDefault()}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-[var(--surface,#f1f3f6)]"
                >
                  Set as Default
                </button>
              )}
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="block w-full px-4 py-2 text-left text-sm text-[var(--danger,#d32f2f)] hover:bg-[var(--surface,#f1f3f6)]"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm font-medium text-[var(--text-primary,#212121)]">
        {address.name} <span className="font-normal text-[var(--text-secondary,#878787)]">{address.phone}</span>
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary,#878787)]">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} -{" "}
        <span className="font-medium text-[var(--text-primary,#212121)]">{address.pincode}</span>
      </p>
    </article>
  );
}

export function AddressList() {
  const { data: addresses, isLoading, isError, error } = useAddresses();
  const createAddress = useCreateAddress();
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(input: CreateAddressInput) {
    await createAddress.mutateAsync(input);
    setShowForm(false);
  }

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-sm bg-white shadow-sm" />;
  }

  if (isError) {
    return <p className="text-sm text-[var(--danger,#d32f2f)]">{error.message}</p>;
  }

  const list = addresses ?? [];

  return (
    <div className="rounded-sm bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="flex w-full items-center gap-2 border-b border-[var(--border,#e0e0e0)] px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide text-[var(--primary,#2874f0)] hover:bg-[var(--surface,#f1f3f6)]"
      >
        <Plus className="size-4" />
        Add a New Address
      </button>

      {showForm && (
        <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-4">
          <AddressForm
            onSubmit={handleCreate}
            submitLabel="Save Address"
            isSubmitting={createAddress.isPending}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {list.map((address, index) => (
        <AddressCard key={address.id} address={address} isLast={index === list.length - 1} />
      ))}
    </div>
  );
}
