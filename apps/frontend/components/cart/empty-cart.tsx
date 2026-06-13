"use client";

import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="mx-auto mt-6 max-w-lg rounded-sm bg-white px-6 py-12 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <svg viewBox="0 0 120 100" className="mb-6 h-28 w-36" aria-hidden="true">
          <path
            d="M25 35 L35 18 H85 L95 35"
            stroke="#bdbdbd"
            strokeWidth="2.5"
            fill="none"
          />
          <rect x="22" y="35" width="76" height="50" rx="3" fill="none" stroke="#bdbdbd" strokeWidth="2.5" />
          <rect x="38" y="48" width="18" height="14" rx="2" fill="#ffe500" />
          <text x="44" y="59" fontSize="10" fontWeight="bold" fill="#2874f0">f</text>
          <circle cx="38" cy="88" r="5" fill="none" stroke="#bdbdbd" strokeWidth="2" />
          <circle cx="82" cy="88" r="5" fill="none" stroke="#bdbdbd" strokeWidth="2" />
        </svg>
        <h2 className="text-lg font-medium text-[var(--text-primary,#212121)]">
          Missing Cart items?
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary,#878787)]">
          Login to see the items you added previously
        </p>
        <Link
          href="/login?callbackUrl=/cart"
          className="mt-6 inline-flex h-11 min-w-[140px] items-center justify-center rounded-sm bg-[var(--primary,#2874f0)] px-8 text-sm font-medium text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
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
    </div>
  );
}
