import express from "express";

import {
  addAddressHandler,
  deleteAddressHandler,
  getAddressesHandler,
  setDefaultAddressHandler,
  updateAddressHandler,
  validateCreateAddress,
  validateUpdateAddress,
} from "../controllers/address.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAddressesHandler);
router.post("/", validateCreateAddress, addAddressHandler);
router.patch("/:id", validateUpdateAddress, updateAddressHandler);
router.delete("/:id", deleteAddressHandler);
router.patch("/:id/default", setDefaultAddressHandler);

export default router;
