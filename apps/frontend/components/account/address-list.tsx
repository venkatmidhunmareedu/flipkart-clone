"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

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
import { cn } from "@/lib/utils";

type AddressCardProps = {
  address: Address;
};

function AddressCard({ address }: AddressCardProps) {
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
      <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-4">
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
    <article className="relative rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-[var(--surface,#f1f3f6)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--text-secondary,#878787)]">
            {address.type}
          </span>
          {address.isDefault && (
            <span className="rounded-sm bg-[var(--primary,#2874f0)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary,#2874f0)]">
              Default
            </span>
          )}
        </div>

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

      <p className="mt-3 text-sm font-medium text-[var(--text-primary,#212121)]">
        {address.name} · {address.phone}
      </p>
      <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} -{" "}
        <span className="font-semibold text-[var(--text-primary,#212121)]">{address.pincode}</span>
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
    return <div className="h-32 animate-pulse rounded-sm bg-white" />;
  }

  if (isError) {
    return <p className="text-sm text-[var(--danger,#d32f2f)]">{error.message}</p>;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className={cn(
          "w-full rounded-sm border border-dashed border-[var(--primary,#2874f0)] bg-white px-4 py-3 text-left text-sm font-medium text-[var(--primary,#2874f0)] hover:bg-[var(--primary,#2874f0)]/5",
        )}
      >
        + ADD A NEW ADDRESS
      </button>

      {showForm && (
        <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white p-4">
          <AddressForm
            onSubmit={handleCreate}
            submitLabel="Save Address"
            isSubmitting={createAddress.isPending}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {(addresses ?? []).map((address) => (
        <AddressCard key={address.id} address={address} />
      ))}
    </div>
  );
}
