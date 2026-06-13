import type { Product } from "@prisma/client";

export type FormattedProduct = ReturnType<typeof formatProduct>;

export function formatProduct(product: Product & { category?: { id: string; name: string; slug: string } | null }) {
  const discountPercent =
    product.mrp > 0
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    images: product.images,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : undefined,
    mrp: product.mrp / 100,
    sellingPrice: product.sellingPrice / 100,
    mrpPaise: product.mrp,
    sellingPricePaise: product.sellingPrice,
    discountPercent,
    inStock: product.stock > 0,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isFeatured: product.isFeatured,
    isAssured: product.isAssured,
    attributes: product.attributes,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
