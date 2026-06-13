"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  CreditCard,
  FolderOpen,
  Package,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

type NavSection = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: NavLink[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "MY ORDERS",
    icon: Package,
    links: [{ label: "Orders", href: "/account/orders" }],
  },
  {
    title: "ACCOUNT SETTINGS",
    icon: User,
    links: [
      { label: "Profile Information", href: "/account/profile" },
      { label: "Manage Addresses", href: "/account/addresses" },
    ],
  },
  {
    title: "PAYMENTS",
    icon: CreditCard,
    links: [
      { label: "Gift Cards", href: "/account/payments/gift-cards" },
      { label: "Saved UPI", href: "/account/payments/saved-upi" },
      { label: "Saved Cards", href: "/account/payments/saved-cards" },
    ],
  },
  {
    title: "MY STUFF",
    icon: FolderOpen,
    links: [{ label: "My Wishlist", href: "/wishlist" }],
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? "User";

  return (
    <aside className="w-full shrink-0 md:w-[260px]">
      <div className="mb-3 rounded-sm bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent,#ffe500)]">
            <User className="size-6 text-[var(--primary,#2874f0)]" />
          </span>
          <div>
            <p className="text-xs text-[var(--text-secondary,#878787)]">Hello,</p>
            <p className="font-medium text-[var(--text-primary,#212121)]">{displayName}</p>
          </div>
        </div>
      </div>

      <nav className="rounded-sm bg-white p-2 shadow-sm">
        {NAV_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOrdersSection = section.title === "MY ORDERS";

          return (
            <div key={section.title} className="border-b border-[var(--border,#e0e0e0)] last:border-b-0">
              {isOrdersSection ? (
                <Link
                  href="/account/orders"
                  className="flex items-center justify-between px-3 py-3 text-sm font-semibold text-[var(--text-primary,#212121)] hover:bg-[var(--surface,#f1f3f6)]"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 text-[var(--primary,#2874f0)]" />
                    {section.title}
                  </span>
                  <ChevronRight className="size-4 text-[var(--text-secondary,#878787)]" />
                </Link>
              ) : (
                <>
                  <p className="flex items-center gap-2 px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-[var(--text-secondary,#878787)]">
                    <Icon className="size-3.5 text-[var(--primary,#2874f0)]" />
                    {section.title}
                  </p>
                  <ul className="pb-2">
                    {section.links.map((link) => {
                      const isActive =
                        pathname === link.href ||
                        (link.href.startsWith("/account/orders") &&
                          pathname.startsWith(`${link.href}/`));

                      return (
                        <li key={`${section.title}-${link.label}`}>
                          <Link
                            href={link.href}
                            className={cn(
                              "block px-3 py-2 pl-8 text-sm transition-colors",
                              isActive
                                ? "bg-[var(--primary,#2874f0)]/10 font-medium text-[var(--primary,#2874f0)]"
                                : "text-[var(--text-primary,#212121)] hover:bg-[var(--surface,#f1f3f6)]",
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
