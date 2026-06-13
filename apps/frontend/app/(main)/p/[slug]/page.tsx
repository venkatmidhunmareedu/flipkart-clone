import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductSpecs } from "@/components/product/product-specs";
import { SimilarProducts } from "@/components/product/similar-products";
import { getProductBySlug, getSimilarProducts } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.ok) {
    return { title: "Product Not Found | Flipkart Clone" };
  }

  const { product } = result.data;
  return {
    title: `${product.title} | Flipkart Clone`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  const similarResult = await getSimilarProducts(slug, 8);
  const similar = similarResult.ok ? similarResult.data.products : [];

  const { product, breadcrumb } = result.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImageGallery
          images={product.images}
          title={product.title}
          productId={product.id}
        />
        <ProductInfo product={product} breadcrumb={breadcrumb} />
      </div>

      <ProductSpecs product={product} />
      <SimilarProducts products={similar} />
    </div>
  );
}
