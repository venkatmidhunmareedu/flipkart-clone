import { MainShell } from "@/components/layout/main-shell";
import { getCategories } from "@/lib/api";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const categoriesResult = await getCategories();
  const categories = categoriesResult.ok ? categoriesResult.data.categories : [];

  return <MainShell categories={categories}>{children}</MainShell>;
}
