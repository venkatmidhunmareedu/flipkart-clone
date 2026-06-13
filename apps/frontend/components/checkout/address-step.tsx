"use client";

import { useState } from "react";

import { AddressForm } from "@/components/checkout/address-form";
import { useAddresses, useCreateAddress } from "@/hooks/use-addresses";
import type { Address } from "@/lib/address-api";

type AddressStepProps = {
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
};

function typeBadge(type: Address["type"]) {
  return type === "HOME" ? "HOME" : type === "WORK" ? "WORK" : "OTHER";
}

export function AddressStep({ selectedAddressId, onSelectAddress }: AddressStepProps) {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const [showForm, setShowForm] = useState(false);
  const [manualActiveId, setManualActiveId] = useState<string | null>(selectedAddressId);
  const defaultAddressId =
    addresses.length > 0
      ? (addresses.find((address) => address.isDefault) ?? addresses[0]).id
      : null;
  const activeId = manualActiveId ?? defaultAddressId;

  if (isLoading) {
    return <p className="p-6 text-sm text-[var(--text-secondary,#878787)]">Loading addresses...</p>;
  }

  return (
    <div className="rounded-sm border border-[var(--border,#e0e0e0)] bg-white">
      <div className="border-b border-[var(--border,#e0e0e0)] px-4 py-3">
        <h2 className="text-base font-medium text-[var(--text-primary,#212121)]">
          Select Delivery Address
        </h2>
      </div>

      <div className="divide-y divide-[var(--border,#e0e0e0)]">
        {addresses.map((address) => {
          const isSelected = activeId === address.id;

          return (
            <label
              key={address.id}
              className={`flex cursor-pointer gap-4 px-4 py-4 ${
                isSelected ? "bg-[var(--primary,#2874f0)]/5" : ""
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={isSelected}
                onChange={() => setManualActiveId(address.id)}
                className="mt-1 accent-[var(--primary,#2874f0)]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[var(--text-primary,#212121)]">
                    {address.name}
                  </span>
                  <span className="rounded-sm bg-[var(--primary,#2874f0)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary,#2874f0)]">
                    {typeBadge(address.type)}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs text-[var(--text-secondary,#878787)]">Default</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} —{" "}
                  {address.pincode}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary,#878787)]">
                  {address.phone}
                </p>
                {isSelected && (
                  <button
                    type="button"
                    onClick={() => onSelectAddress(address)}
                    className="mt-3 rounded-sm bg-[var(--primary,#2874f0)] px-6 py-2 text-sm font-medium text-white hover:bg-[#1a62d9]"
                  >
                    Deliver Here
                  </button>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
        >
          {showForm ? "Cancel" : "+ Add a New Address"}
        </button>

        {showForm && (
          <AddressForm
            isSubmitting={createAddress.isPending}
            onSubmit={async (input) => {
              const address = await createAddress.mutateAsync(input);
              setManualActiveId(address.id);
              setShowForm(false);
              onSelectAddress(address);
            }}
          />
        )}
      </div>
    </div>
  );
}
