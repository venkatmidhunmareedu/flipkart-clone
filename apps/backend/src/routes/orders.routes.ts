import express from "express";

import {
  checkDeliveryHandler,
  confirmOrderHandler,
  getOrderByIdHandler,
  getOrdersHandler,
  initiateOrderHandler,
  validateCheckDelivery,
  validateConfirmOrder,
  validateInitiateOrder,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/check-delivery", validateCheckDelivery, checkDeliveryHandler);
router.post("/initiate", validateInitiateOrder, initiateOrderHandler);
router.post("/confirm", validateConfirmOrder, confirmOrderHandler);
router.get("/", getOrdersHandler);
router.get("/:id", getOrderByIdHandler);

export default router;
