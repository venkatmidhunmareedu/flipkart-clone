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

export function MainShell({ categories, children }: MainShellProps) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");

  if (isCheckout) {
    return <>{children}</>;
  }

  const activeCategorySlug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface,#f1f3f6)]">
      <Header />
      <CategoryNav categories={categories} activeSlug={activeCategorySlug} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
