import express from "express";

import {
  addToWishlistHandler,
  getWishlistHandler,
  getWishlistIdsHandler,
  removeFromWishlistHandler,
  validateAddToWishlist,
} from "../controllers/wishlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWishlistHandler);
router.get("/ids", getWishlistIdsHandler);
router.post("/", validateAddToWishlist, addToWishlistHandler);
router.delete("/:productId", removeFromWishlistHandler);

export default router;
