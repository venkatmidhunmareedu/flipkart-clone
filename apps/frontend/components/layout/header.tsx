"use client";

import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";

import { CartCountBadge } from "@/components/cart/cart-count-badge";
import {
  CartIcon,
  FlipkartBagIcon,
  HouseIcon,
  SearchMagnifierIcon,
} from "@/components/icons/flipkart-icons";
import { SearchBar } from "@/components/layout/search-bar";
import { UserMenu } from "@/components/layout/user-menu";
import { useAddresses } from "@/hooks/use-addresses";
import type { Address } from "@/lib/address-api";
import { cn } from "@/lib/utils";

type HeaderVariant = "blue" | "white";

type HeaderProps = {
  variant?: HeaderVariant;
};

function SearchBarFallback({ variant }: { variant: HeaderVariant }) {
  return (
    <div className={cn("w-full", variant === "blue" && "hidden md:block")}>
      <div
        className={cn(
          "h-10 animate-pulse rounded-full",
          variant === "blue" ? "bg-white/20" : "border border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)]",
        )}
      />
    </div>
  );
}

function FlipkartPillTabs() {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-full bg-[var(--accent,#ffe500)] px-3 py-1.5"
      >
        <FlipkartBagIcon className="size-5 shrink-0" />
        <span className="text-[15px] font-bold italic tracking-tight text-[var(--primary,#2874f0)]">
          Flipkart
        </span>
      </Link>
    </div>
  );
}

function formatAddressLabel(address: Address): string {
  const line = address.line2 ? `${address.line1}, ${address.line2}` : address.line1;
  return `${address.type} ${line}`;
}

function AddressChip() {
  const { status } = useSession();
  const { data: addresses = [], isLoading } = useAddresses();

  if (status !== "authenticated" || isLoading || addresses.length === 0) {
    return null;
  }

  const address = addresses.find((item) => item.isDefault) ?? addresses[0];

  return (
    <Link
      href="/account/addresses"
      className="hidden max-w-[220px] items-center gap-1 rounded px-2 py-1 hover:bg-[var(--surface,#f1f3f6)] lg:flex"
    >
      <HouseIcon className="size-4 shrink-0 text-[var(--text-primary,#212121)]" />
      <span className="truncate text-xs font-medium text-[var(--text-primary,#212121)]">
        {formatAddressLabel(address)}
      </span>
      <ChevronDown className="size-3 shrink-0 rotate-[-90deg] text-[var(--text-secondary,#878787)]" />
    </Link>
  );
}

function BlueHeaderLogo() {
  return (
    <Link href="/" className="shrink-0">
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold italic tracking-tight text-white">
          Flip<span className="text-[var(--accent,#ffe500)]">kart</span>
        </span>
        <span className="text-[10px] italic text-[var(--accent,#ffe500)]">
          Explore <span className="font-semibold not-italic">Plus</span>
          <span className="ml-0.5 not-italic">+</span>
        </span>
      </div>
    </Link>
  );
}

export function Header({ variant = "white" }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const isBlue = variant === "blue";

  if (isBlue) {
    return (
      <>
        <header className="bg-[var(--primary,#2874f0)] text-white">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:gap-4">
            <BlueHeaderLogo />
            <Suspense fallback={<SearchBarFallback variant="blue" />}>
              <SearchBar variant="blue" />
            </Suspense>
            <div className="ml-auto flex items-center gap-1 sm:gap-3">
              <UserMenu variant="blue" />
              <Link
                href="/cart"
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-white/10"
              >
                <span className="relative">
                  <CartIcon className="size-5" />
                  <CartCountBadge />
                </span>
                <span className="hidden text-sm font-medium sm:inline">Cart</span>
              </Link>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <header className="border-b border-[var(--border,#e0e0e0)] bg-white text-[var(--text-primary,#212121)]">
        <div className="mx-auto max-w-[1400px] px-4">
          {/* Row 1 — pill tabs + utilities */}
          <div className="flex items-center gap-3 py-2">
            <FlipkartPillTabs />

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
              <AddressChip />
              <UserMenu variant="white" />

              <details className="relative hidden sm:block">
                <summary className="flex cursor-pointer list-none items-center gap-0.5 rounded px-2 py-1 text-xs font-medium hover:bg-[var(--surface,#f1f3f6)] [&::-webkit-details-marker]:hidden">
                  More
                  <ChevronDown className="size-3.5" />
                </summary>
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-sm bg-white py-1 text-[var(--text-primary,#212121)] shadow-lg">
                  <span className="block px-4 py-2 text-sm text-[var(--text-secondary,#878787)]">
                    Notification Preferences
                  </span>
                  <span className="block px-4 py-2 text-sm text-[var(--text-secondary,#878787)]">
                    24×7 Customer Care
                  </span>
                </div>
              </details>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex size-8 items-center justify-center rounded md:hidden"
                aria-label="Open search"
              >
                <SearchMagnifierIcon className="size-5" />
              </button>

              <Link
                href="/cart"
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-[var(--surface,#f1f3f6)]"
              >
                <span className="relative">
                  <CartIcon className="size-5" />
                  <CartCountBadge alwaysShow />
                </span>
                <span className="hidden text-xs font-medium sm:inline">Cart</span>
              </Link>
            </div>
          </div>

          {/* Row 2 — search (desktop) */}
          <div className="relative z-20 hidden pb-2.5 md:block">
            <Suspense fallback={<SearchBarFallback variant="white" />}>
              <SearchBar variant="white" layout="header" />
            </Suspense>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex size-9 shrink-0 items-center justify-center rounded hover:bg-[var(--surface,#f1f3f6)]"
              aria-label="Close search"
            >
              <X className="size-5 text-[var(--text-primary,#212121)]" />
            </button>
            <Suspense
              fallback={
                <div className="h-10 flex-1 animate-pulse rounded-full border border-[var(--border,#e0e0e0)] bg-[var(--surface,#f1f3f6)]" />
              }
            >
              <SearchBar
                variant="white"
                layout="overlay"
                autoFocus
                onClose={() => setSearchOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
