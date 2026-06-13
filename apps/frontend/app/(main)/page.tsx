import { ProductCarousel } from "@/components/home/product-carousel";
import { getFeaturedProducts, getProducts } from "@/lib/api";

export default async function Home() {
  const [featuredResult, saleResult] = await Promise.all([
    getFeaturedProducts(12),
    getProducts({ sort: "price_desc", limit: 12 }),
  ]);

  const featured = featuredResult.ok ? featuredResult.data.products : [];
  const saleProducts = saleResult.ok ? saleResult.data.products : [];

  return (
    <div className="mx-auto max-w-[1400px] bg-white">
      <ProductCarousel title="Suggested For You" products={featured} />

      {saleProducts.length > 0 && (
        <div className="mt-2 px-4">
          <ProductCarousel title="End of Season Sale" products={saleProducts} variant="sale" />
        </div>
      )}
    </div>
  );
}
