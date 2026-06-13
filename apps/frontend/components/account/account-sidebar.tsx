"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

type NavSection = {
  title: string;
  links: NavLink[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "MY ORDERS",
    links: [{ label: "My Orders", href: "/account/orders" }],
  },
  {
    title: "ACCOUNT SETTINGS",
    links: [
      { label: "Profile Information", href: "/account/profile" },
      { label: "Manage Addresses", href: "/account/addresses" },
    ],
  },
  {
    title: "MY STUFF",
    links: [{ label: "My Wishlist", href: "/wishlist" }],
  },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getColorFromName(name?: string | null) {
  const palette = ["#2874f0", "#388e3c", "#f57c00", "#7b1fa2", "#c62828"];
  const source = name ?? "user";
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "User";
  const initials = getInitials(session?.user?.name);
  const avatarColor = getColorFromName(session?.user?.name);

  return (
    <aside className="w-full shrink-0 md:w-[250px]">
      <div className="rounded-sm bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-[var(--border,#e0e0e0)] pb-4">
          <span
            className="flex size-12 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </span>
          <div>
            <p className="text-xs text-[var(--text-secondary,#878787)]">Hello,</p>
            <p className="font-medium text-[var(--text-primary,#212121)]">{firstName}</p>
          </div>
        </div>

        <nav className="mt-4 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-xs font-medium tracking-wide text-[var(--text-secondary,#878787)]">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/wishlist" && pathname.startsWith(`${link.href}/`));

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block rounded-sm px-3 py-2 text-sm transition-colors",
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
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
