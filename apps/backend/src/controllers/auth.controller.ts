import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

import { signAccessToken } from "../lib/jwt";
import {
  AuthError,
  loginUser,
  registerUser,
  resendEmailOTP,
  resetPassword,
  sendPasswordResetOTP,
  verifyEmailOTPByEmail,
} from "../services/auth.service";

type ValidatedRequest<T> = Request & { validated: T };

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Validation failed";
      res.status(400).json({
        error: { message, code: "VALIDATION_ERROR" },
      });
      return;
    }

    (req as ValidatedRequest<T>).validated = result.data;
    next();
  };
}

function handleAuthError(error: unknown, res: Response) {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      error: { message: error.message, code: error.code },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}

export async function register(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{
      email: string;
      password: string;
      firstName: string;
      lastName?: string;
    }>).validated;

    const user = await registerUser(body);
    res.status(201).json({ data: { user } });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{ email: string; password: string }>)
      .validated;

    const user = await loginUser(body);
    const token = signAccessToken({ id: user.id, email: user.email });
    res.json({ data: { user, token } });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{ email: string; code: string }>)
      .validated;

    const result = await verifyEmailOTPByEmail(body.email, body.code);
    res.json({ data: result });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function resendOtp(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{ email: string }>).validated;
    const result = await resendEmailOTP(body.email);
    res.json({ data: result });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{ email: string }>).validated;
    const result = await sendPasswordResetOTP(body.email);
    res.json({ data: result });
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const body = (req as ValidatedRequest<{
      email: string;
      code: string;
      newPassword: string;
    }>).validated;

    const result = await resetPassword(
      body.email,
      body.code,
      body.newPassword,
    );
    res.json({ data: result });
  } catch (error) {
    handleAuthError(error, res);
  }
}
