import Link from "next/link";

import { CategoryNav } from "@/components/layout/category-nav";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface,#f1f3f6)]">
      <Header variant="blue" />
      <CategoryNav categories={[]} variant="text" />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
