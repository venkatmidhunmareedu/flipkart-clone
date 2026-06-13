"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { UserProfileIcon } from "@/components/icons/flipkart-icons";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  variant?: "blue" | "white";
};

type MenuLink = {
  href: string;
  label: string;
};

const AUTHENTICATED_LINKS: MenuLink[] = [
  { href: "/account/profile", label: "My Profile" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/wishlist", label: "My Wishlist" },
  { href: "/account/addresses", label: "Manage Addresses" },
];

export function UserMenu({ variant = "white" }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isBlue = variant === "blue";

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-9 w-20 animate-pulse rounded",
          isBlue ? "bg-white/20" : "bg-[var(--surface,#f1f3f6)]",
        )}
      />
    );
  }

  const triggerClass = cn(
    "flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-medium",
    isBlue ? "hover:bg-white/10" : "hover:bg-[var(--surface,#f1f3f6)]",
  );

  if (!session?.user) {
    return (
      <div ref={menuRef} className="relative">
        <button type="button" className={triggerClass} onClick={() => setOpen((prev) => !prev)}>
          <UserProfileIcon className="size-4 shrink-0" />
          <span className="hidden sm:inline">Login</span>
          <ChevronDown className="size-3.5" />
        </button>
        {open ? (
          <div className="absolute right-0 z-50 mt-1 w-56 rounded-sm bg-white py-2 text-[var(--text-primary,#212121)] shadow-lg">
            <p className="border-b border-[var(--border,#e0e0e0)] px-4 py-2 text-xs text-[var(--text-secondary,#878787)]">
              New Customer?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--primary,#2874f0)]"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </p>
            <Link
              href="/login"
              className="mx-4 my-2 flex h-9 items-center justify-center rounded-sm bg-[var(--primary,#2874f0)] text-sm font-medium text-white hover:bg-[var(--primary-dark,#1a5fd1)]"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/account/profile"
              className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
              onClick={() => setOpen(false)}
            >
              My Profile
            </Link>
            <Link
              href="/account/orders"
              className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
              onClick={() => setOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/wishlist"
              className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
              onClick={() => setOpen(false)}
            >
              Wishlist
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  const initials = session.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button type="button" className={triggerClass} onClick={() => setOpen((prev) => !prev)}>
        {isBlue ? (
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[var(--primary,#2874f0)]">
            {initials || "U"}
          </span>
        ) : (
          <UserProfileIcon className="size-4 shrink-0" />
        )}
        <span className="hidden max-w-24 truncate sm:inline">
          {session.user.name?.split(" ")[0] ?? "Account"}
        </span>
        <ChevronDown className="size-3.5" />
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-1 w-56 rounded-sm bg-white py-2 text-[var(--text-primary,#212121)] shadow-lg">
          {AUTHENTICATED_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm hover:bg-[var(--surface,#f1f3f6)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut({ callbackUrl: "/" });
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-[var(--surface,#f1f3f6)]"
          >
            Sign Out
          </button>
        </div>
      ) : null}
    </div>
  );
}
