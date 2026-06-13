import express from "express";

import { getCategory, listCategories } from "../controllers/product.controller";

const router = express.Router();

router.get("/", listCategories);
router.get("/:slug", getCategory);

export default router;
