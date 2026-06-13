import Link from "next/link";

import { SearchBar } from "@/components/layout/search-bar";
import { Suspense } from "react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface,#f1f3f6)]">
      <header className="border-b border-[var(--border,#e0e0e0)] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
          <Link href="/" className="shrink-0">
            <div className="rounded-sm bg-[var(--accent,#ffe500)] px-3 py-1.5 leading-none">
              <span className="text-lg font-bold italic tracking-tight text-[var(--primary,#2874f0)]">
                Flipkart
              </span>
            </div>
          </Link>
          <Suspense fallback={<div className="h-10 flex-1 animate-pulse rounded-sm bg-[var(--surface,#f1f3f6)]" />}>
            <SearchBar variant="white" />
          </Suspense>
          <p className="hidden text-sm font-medium text-[var(--text-secondary,#878787)] sm:block">
            Secure Checkout
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-4">{children}</div>
    </div>
  );
}
