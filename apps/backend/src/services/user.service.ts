import bcrypt from "bcryptjs";

import prisma from "../lib/prisma";
import { sendEmailOTP } from "./auth.service";

const BCRYPT_ROUNDS = 12;

export class UserError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "UserError";
  }
}

function formatUser(user: {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string | null;
  gender: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UserError("User not found", "NOT_FOUND", 404);
  }

  return formatUser(user);
}

export async function updateProfile(
  userId: string,
  input: { firstName?: string; lastName?: string; gender?: string },
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.gender !== undefined && { gender: input.gender }),
    },
  });

  return formatUser(user);
}

export async function updateEmail(userId: string, newEmail: string) {
  const normalizedEmail = newEmail.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing && existing.id !== userId) {
    throw new UserError("Email already in use", "EMAIL_EXISTS", 409);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      email: normalizedEmail,
      emailVerified: false,
    },
  });

  await sendEmailOTP(user.id, user.email);

  return formatUser(user);
}

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UserError("User not found", "NOT_FOUND", 404);
  }

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!valid) {
    throw new UserError("Current password is incorrect", "INVALID_PASSWORD", 401);
  }

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { changed: true };
}
