import express from "express";

import {
  addToCartHandler,
  clearCartHandler,
  getCartHandler,
  removeFromCartHandler,
  updateQuantityHandler,
  validateAddToCart,
  validateUpdateQuantity,
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCartHandler);
router.post("/", validateAddToCart, addToCartHandler);
router.delete("/", clearCartHandler);
router.patch("/:productId", validateUpdateQuantity, updateQuantityHandler);
router.delete("/:productId", removeFromCartHandler);

export default router;
