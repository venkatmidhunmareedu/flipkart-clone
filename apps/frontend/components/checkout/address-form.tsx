"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AddressType, CreateAddressInput } from "@/lib/address-api";

type AddressFormProps = {
  onSubmit: (input: CreateAddressInput) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
  initialValues?: CreateAddressInput;
  onCancel?: () => void;
};

const ADDRESS_TYPES: { value: AddressType; label: string }[] = [
  { value: "HOME", label: "Home" },
  { value: "WORK", label: "Work" },
  { value: "OTHER", label: "Other" },
];

export function AddressForm({
  onSubmit,
  submitLabel = "Save and Deliver Here",
  isSubmitting = false,
  initialValues,
  onCancel,
}: AddressFormProps) {
  const [form, setForm] = useState<CreateAddressInput>(
    initialValues ?? {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      type: "HOME",
    },
  );
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof CreateAddressInput>(
    key: K,
    value: CreateAddressInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }

    try {
      await onSubmit(form);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save address");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-[var(--border,#e0e0e0)] pt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-secondary,#878787)]">Name</span>
          <Input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="rounded-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-secondary,#878787)]">Phone</span>
          <Input
            required
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, ""))}
            className="rounded-sm"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--text-secondary,#878787)]">
          Flat / House No. / Building
        </span>
        <Input
          required
          value={form.line1}
          onChange={(event) => updateField("line1", event.target.value)}
          className="rounded-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--text-secondary,#878787)]">
          Area / Street / Sector
        </span>
        <Input
          value={form.line2 ?? ""}
          onChange={(event) => updateField("line2", event.target.value)}
          className="rounded-sm"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-secondary,#878787)]">City</span>
          <Input
            required
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
            className="rounded-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-secondary,#878787)]">State</span>
          <Input
            required
            value={form.state}
            onChange={(event) => updateField("state", event.target.value)}
            className="rounded-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-secondary,#878787)]">Pincode</span>
          <Input
            required
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, ""))}
            className="rounded-sm"
          />
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm text-[var(--text-secondary,#878787)]">Address Type</span>
        <div className="flex flex-wrap gap-2">
          {ADDRESS_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateField("type", type.value)}
              className={`rounded-sm border px-4 py-2 text-sm font-medium ${
                form.type === type.value
                  ? "border-[var(--primary,#2874f0)] bg-[var(--primary,#2874f0)]/10 text-[var(--primary,#2874f0)]"
                  : "border-[var(--border,#e0e0e0)] text-[var(--text-secondary,#878787)]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-[var(--danger,#d32f2f)]">{error}</p>}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 flex-1 rounded-sm bg-[var(--primary,#2874f0)] text-white hover:bg-[#1a62d9]"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-11 rounded-sm"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
