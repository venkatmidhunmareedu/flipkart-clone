import express from "express";

import {
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPasswordHandler,
  validateBody,
  verifyEmail,
} from "../controllers/auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../lib/validators/auth.validators";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", validateBody(resendOtpSchema), resendOtp);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPasswordHandler);

export default router;
