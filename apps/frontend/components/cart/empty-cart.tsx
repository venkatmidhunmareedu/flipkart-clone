"use client";

import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <svg
        viewBox="0 0 120 120"
        className="mb-6 h-32 w-32 text-[var(--text-secondary,#878787)]"
        aria-hidden="true"
      >
        <rect x="20" y="35" width="80" height="55" rx="4" fill="currentColor" opacity="0.15" />
        <path
          d="M35 35 L45 15 H75 L85 35"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="45" cy="95" r="6" fill="currentColor" opacity="0.4" />
        <circle cx="75" cy="95" r="6" fill="currentColor" opacity="0.4" />
      </svg>
      <h2 className="text-lg font-medium text-[var(--text-primary,#212121)]">
        Missing Cart items?
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
        Login to see the items you added previously
      </p>
      <Link
        href="/login?callbackUrl=/cart"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-sm bg-[var(--primary,#2874f0)] px-10 text-sm font-medium text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
      >
        Login
      </Link>
      <Link
        href="/"
        className="mt-4 text-sm font-medium text-[var(--primary,#2874f0)] hover:underline"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
