"use client";

import Link from "next/link";
import { ShoppingCart, Search, X } from "lucide-react";
import { Suspense, useState } from "react";

import { CartCountBadge } from "@/components/cart/cart-count-badge";
import { SearchBar } from "@/components/layout/search-bar";
import { UserMenu } from "@/components/layout/user-menu";

function SearchBarFallback() {
  return (
    <div className="hidden min-w-0 flex-1 md:block">
      <div className="h-10 animate-pulse rounded-sm bg-white/20" />
    </div>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-[var(--primary,#2874f0)] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4">
          <Link href="/" className="shrink-0">
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold italic tracking-tight">
                Flip<span className="text-[var(--accent,#ffe500)]">kart</span>
              </span>
              <span className="text-[10px] italic text-[var(--accent,#ffe500)]">
                Explore <span className="font-semibold not-italic">Plus</span>
              </span>
            </div>
          </Link>

          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex size-9 items-center justify-center rounded hover:bg-white/10 md:hidden"
            aria-label="Open search"
          >
            <Search className="size-5" />
          </button>

          <div className="ml-auto flex items-center gap-1 sm:gap-4">
            <UserMenu />

            <Link
              href="/cart"
              className="flex items-center gap-1 rounded px-2 py-1 hover:bg-white/10"
            >
              <span className="relative">
                <ShoppingCart className="size-5" />
                <CartCountBadge />
              </span>
              <span className="hidden text-sm font-medium sm:inline">Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--primary,#2874f0)] md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex size-9 shrink-0 items-center justify-center rounded hover:bg-white/10"
              aria-label="Close search"
            >
              <X className="size-5 text-white" />
            </button>
            <Suspense fallback={<div className="h-10 flex-1 animate-pulse rounded-sm bg-white/20" />}>
              <SearchBar variant="overlay" autoFocus onClose={() => setSearchOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
