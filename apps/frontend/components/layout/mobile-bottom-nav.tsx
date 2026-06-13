"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Heart, Home, User } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", icon: Home, match: (path: string) => path === "/" },
  {
    label: "Categories",
    href: "/category/electronics",
    icon: Grid3X3,
    match: (path: string) => path.startsWith("/category"),
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    match: (path: string) => path.startsWith("/wishlist"),
  },
  {
    label: "Account",
    href: "/account/profile",
    icon: User,
    match: (path: string) => path.startsWith("/account") || path === "/login",
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border,#e0e0e0)] bg-white md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-7xl">
        {TABS.map((tab) => {
          const isActive = tab.match(pathname);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--primary,#2874f0)]"
                  : "text-[var(--text-secondary,#878787)]",
              )}
            >
              <Icon className={cn("size-5", isActive && "fill-[var(--primary,#2874f0)]/10")} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
