"use client";

import { usePathname } from "next/navigation";

import { AccountSidebar } from "@/components/account/account-sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/account/profile": "Personal Information",
  "/account/addresses": "Manage Addresses",
  "/account/orders": "My Orders",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">
          {pageTitle && (
            <h1 className="mb-4 text-lg font-medium text-[var(--text-primary,#212121)]">{pageTitle}</h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
