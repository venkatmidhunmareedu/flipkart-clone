"use client";

import { usePathname } from "next/navigation";

import { CategoryNav } from "@/components/layout/category-nav";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { Category } from "@/lib/api";

type MainShellProps = {
  categories: Category[];
  children: React.ReactNode;
};

function getHeaderVariant(pathname: string): "blue" | "white" {
  if (
    pathname.startsWith("/account") ||
    pathname.startsWith("/wishlist")
  ) {
    return "blue";
  }
  return "white";
}

function getCategoryNavVariant(pathname: string): "icons" | "text" | "home" {
  if (pathname === "/") {
    return "home";
  }
  if (
    pathname.startsWith("/account") ||
    pathname.startsWith("/wishlist")
  ) {
    return "text";
  }
  return "icons";
}

export function MainShell({ categories, children }: MainShellProps) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  const isHome = pathname === "/";

  if (isCheckout) {
    return <>{children}</>;
  }

  const activeCategorySlug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : undefined;

  const headerVariant = getHeaderVariant(pathname);
  const categoryNavVariant = getCategoryNavVariant(pathname);

  return (
    <div
      className={
        isHome
          ? "flex min-h-screen flex-col bg-white"
          : "flex min-h-screen flex-col bg-[var(--surface,#f1f3f6)]"
      }
    >
      <Header variant={headerVariant} />
      <CategoryNav
        categories={categories}
        activeSlug={activeCategorySlug}
        variant={categoryNavVariant}
      />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
