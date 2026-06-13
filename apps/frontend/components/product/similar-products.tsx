import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/lib/api";

type SimilarProductsProps = {
  products: Product[];
};

export function SimilarProducts({ products }: SimilarProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <ProductCarousel title="Similar Products" products={products} />
    </div>
  );
}
