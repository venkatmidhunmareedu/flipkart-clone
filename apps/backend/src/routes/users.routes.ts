import express from "express";

import {
  changePasswordHandler,
  getProfileHandler,
  updateEmailHandler,
  updateProfileHandler,
  validateChangePassword,
  validateUpdateEmail,
  validateUpdateProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getProfileHandler);
router.patch("/me", validateUpdateProfile, updateProfileHandler);
router.patch("/me/email", validateUpdateEmail, updateEmailHandler);
router.patch("/me/password", validateChangePassword, changePasswordHandler);

export default router;
