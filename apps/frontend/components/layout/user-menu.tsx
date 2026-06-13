"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded bg-white/20" />;
  }

  if (!session?.user) {
    return (
      <details className="relative">
        <summary className="cursor-pointer list-none rounded px-3 py-2 text-sm font-medium hover:bg-white/10 [&::-webkit-details-marker]:hidden">
          Login
        </summary>
        <div className="absolute right-0 z-50 mt-2 w-56 rounded bg-white py-2 text-[var(--text-primary,#212121)] shadow-lg">
          <p className="border-b border-[var(--border,#e0e0e0)] px-4 py-2 text-xs text-[var(--text-secondary,#878787)]">
            New Customer?{" "}
            <Link href="/register" className="font-medium text-[var(--primary,#2874f0)]">
              Sign Up
            </Link>
          </p>
          <Link href="/login" className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]">
            Login
          </Link>
          <Link
            href="/account/profile"
            className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
          >
            My Profile
          </Link>
          <Link
            href="/account/orders"
            className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
          >
            Orders
          </Link>
          <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]">
            Wishlist
          </Link>
        </div>
      </details>
    );
  }

  const initials = session.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded px-2 py-1 hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        <span className="flex size-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--primary,#2874f0)]">
          {initials || "U"}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
          {session.user.name?.split(" ")[0] ?? "Account"}
        </span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-56 rounded bg-white py-2 text-[var(--text-primary,#212121)] shadow-lg">
        <Link
          href="/account/profile"
          className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
        >
          My Profile
        </Link>
        <Link
          href="/account/orders"
          className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
        >
          My Orders
        </Link>
        <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]">
          My Wishlist
        </Link>
        <Link
          href="/account/addresses"
          className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
        >
          Manage Addresses
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="block w-full px-4 py-2 text-left text-sm hover:bg-[var(--surface,#f1f3f6)]"
        >
          Sign Out
        </button>
      </div>
    </details>
  );
}
