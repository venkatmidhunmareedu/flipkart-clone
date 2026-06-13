import express from "express";

import {
  getFeatured,
  getProduct,
  getSimilar,
  listProducts,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/", listProducts);
router.get("/featured", getFeatured);
router.get("/:slug/similar", getSimilar);
router.get("/:slug", getProduct);

export default router;
