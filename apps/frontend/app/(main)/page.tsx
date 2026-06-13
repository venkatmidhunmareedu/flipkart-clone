import Link from "next/link";

import { HeroBanner } from "@/components/home/hero-banner";
import { ProductCarousel } from "@/components/home/product-carousel";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/api";

export default async function Home() {
  const [featuredResult, categoriesResult, saleResult] = await Promise.all([
    getFeaturedProducts(12),
    getCategories(),
    getProducts({ sort: "price_desc", limit: 12 }),
  ]);

  const featured = featuredResult.ok ? featuredResult.data.products : [];
  const categories = categoriesResult.ok ? categoriesResult.data.categories : [];
  const saleProducts = saleResult.ok ? saleResult.data.products : [];

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
      <HeroBanner />

      <ProductCarousel title="Suggested for You" products={featured} />

      <ProductCarousel title="End of Season Sale" products={saleProducts} />

      {categories.length > 0 && (
        <section className="rounded-sm bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium text-[var(--text-primary,#212121)]">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="rounded-sm border border-[var(--border,#e0e0e0)] p-4 text-center transition-colors hover:border-[var(--primary,#2874f0)] hover:bg-[var(--surface,#f1f3f6)]"
              >
                <span className="text-sm font-medium text-[var(--text-primary,#212121)]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
