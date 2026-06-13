"use client";

import { AddressList } from "@/components/account/address-list";

export default function AddressesPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-[var(--text-primary,#212121)]">
        Manage Addresses
      </h1>
      <AddressList />
    </div>
  );
}
