import type { Request, Response } from "express";

import {
  getCategories,
  getCategoryBySlug,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getSimilarProducts,
} from "../services/product.service";

export async function listProducts(req: Request, res: Response) {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy =
      typeof req.query.sort === "string"
        ? (req.query.sort as "relevance" | "price_asc" | "price_desc" | "rating" | "newest")
        : undefined;

    const result = await getProducts({
      categorySlug: category,
      search,
      page,
      limit,
      sortBy,
    });

    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}

export async function getFeatured(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getFeaturedProducts(limit);
    res.json({ data: { products } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const result = await getProductBySlug(req.params.slug);

    if (!result) {
      res.status(404).json({
        error: { message: "Product not found", code: "NOT_FOUND" },
      });
      return;
    }

    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}

export async function getSimilar(req: Request, res: Response) {
  try {
    const result = await getProductBySlug(req.params.slug);

    if (!result) {
      res.status(404).json({
        error: { message: "Product not found", code: "NOT_FOUND" },
      });
      return;
    }

    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getSimilarProducts(
      result.product.id,
      result.product.categoryId,
      limit,
    );

    res.json({ data: { products } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}

export async function listCategories(_req: Request, res: Response) {
  try {
    const categories = await getCategories();
    res.json({ data: { categories } });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const result = await getCategoryBySlug(req.params.slug);

    if (!result) {
      res.status(404).json({
        error: { message: "Category not found", code: "NOT_FOUND" },
      });
      return;
    }

    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" },
    });
  }
}
