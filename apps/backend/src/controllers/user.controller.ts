import type { Request, Response } from "express";

import { validateBody } from "./auth.controller";
import {
  changePasswordSchema,
  updateEmailSchema,
  updateProfileSchema,
  type UpdateProfileInput,
} from "../lib/validators/user.validators";
import {
  UserError,
  changePassword,
  getUserProfile,
  updateEmail,
  updateProfile,
} from "../services/user.service";

function handleUserError(error: unknown, res: Response) {
  if (error instanceof UserError) {
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

export async function getProfileHandler(req: Request, res: Response) {
  try {
    const user = await getUserProfile(req.user!.id);
    res.json({ data: { user } });
  } catch (error) {
    handleUserError(error, res);
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: UpdateProfileInput }).validated;

    const user = await updateProfile(req.user!.id, body);
    res.json({ data: { user } });
  } catch (error) {
    handleUserError(error, res);
  }
}

export async function updateEmailHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & { validated: { newEmail: string } }).validated;
    const user = await updateEmail(req.user!.id, body.newEmail);
    res.json({ data: { user } });
  } catch (error) {
    handleUserError(error, res);
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  try {
    const body = (req as Request & {
      validated: { currentPassword: string; newPassword: string };
    }).validated;

    const result = await changePassword(req.user!.id, body);
    res.json({ data: result });
  } catch (error) {
    handleUserError(error, res);
  }
}

export const validateUpdateProfile = validateBody(updateProfileSchema);
export const validateUpdateEmail = validateBody(updateEmailSchema);
export const validateChangePassword = validateBody(changePasswordSchema);
