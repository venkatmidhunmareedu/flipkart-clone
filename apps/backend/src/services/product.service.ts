import type { Prisma } from "@prisma/client";

import prisma from "../lib/prisma";
import { formatProduct } from "../lib/format-product";

type SortBy = "relevance" | "price_asc" | "price_desc" | "rating" | "newest";

type CategoryForBreadcrumb = {
  id: string;
  name: string;
  slug: string;
  parent?: CategoryForBreadcrumb | null;
};

type GetProductsInput = {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
};

async function getCategoryIdsIncludingChildren(categorySlug: string): Promise<string[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  if (!category) {
    return [];
  }

  const ids: string[] = [category.id];

  for (const child of category.children) {
    ids.push(child.id);
    for (const grandchild of child.children) {
      ids.push(grandchild.id);
    }
  }

  return ids;
}

function buildOrderBy(sortBy: SortBy): Prisma.ProductOrderByWithRelationInput {
  switch (sortBy) {
    case "price_asc":
      return { sellingPrice: "asc" };
    case "price_desc":
      return { sellingPrice: "desc" };
    case "rating":
      return { rating: "desc" };
    case "newest":
      return { createdAt: "desc" };
    case "relevance":
    default:
      return { reviewCount: "desc" };
  }
}

export async function getProducts(input: GetProductsInput) {
  const page = Math.max(input.page ?? 1, 1);
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
  const skip = (page - 1) * limit;
  const sortBy = input.sortBy ?? "relevance";

  const where: Prisma.ProductWhereInput = {};

  if (input.categorySlug) {
    const categoryIds = await getCategoryIdsIncludingChildren(input.categorySlug);
    if (categoryIds.length === 0) {
      return { products: [], total: 0, page, totalPages: 0 };
    }
    where.categoryId = { in: categoryIds };
  }

  if (input.search?.trim()) {
    const query = input.search.trim();
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { brand: { contains: query, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: buildOrderBy(sortBy),
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(formatProduct),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const breadcrumb = [];
  let current: CategoryForBreadcrumb | null = product.category;

  while (current) {
    breadcrumb.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parent ?? null;
  }

  return {
    product: formatProduct(product),
    breadcrumb,
  };
}

export async function getSimilarProducts(productId: string, categoryId: string, limit = 8) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { rating: "desc" },
    take: limit,
  });

  return products.map(formatProduct);
}

export async function getFeaturedProducts(limit = 12) {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { rating: "desc" },
    take: limit,
  });

  return products.map(formatProduct);
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          children: true,
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
      parent: {
        include: {
          parent: true,
        },
      },
    },
  });

  if (!category) {
    return null;
  }

  const breadcrumb = [];
  let current: CategoryForBreadcrumb | null = category;

  while (current) {
    breadcrumb.unshift({ id: current.id, name: current.name, slug: current.slug });
    current = current.parent ?? null;
  }

  return { category, breadcrumb };
}
