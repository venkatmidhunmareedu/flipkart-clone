import bcrypt from "bcryptjs";
import { OTPType } from "@prisma/client";

import prisma from "../lib/prisma";
import { getMailer, isMailerConfigured } from "../lib/mailer";
import { otpEmailHtml, otpEmailText } from "../lib/email-templates";

const BCRYPT_ROUNDS = 12;
const EMAIL_OTP_EXPIRY_MINUTES = 15;
const PASSWORD_RESET_OTP_EXPIRY_MINUTES = 10;

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(
  email: string,
  code: string,
  type: OTPType,
): Promise<void> {
  const subject =
    type === "EMAIL_VERIFY"
      ? "Verify your Flipkart Clone account"
      : "Reset your Flipkart Clone password";

  if (!isMailerConfigured()) {
    console.info(`[dev] OTP for ${email} (${type}): ${code}`);
    return;
  }

  const mailer = getMailer();
  await mailer.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    text: otpEmailText(code, type),
    html: otpEmailHtml(code, type),
  });
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw new AuthError("Email already registered", "EMAIL_EXISTS", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      emailVerified: false,
    },
  });

  await sendEmailOTP(user.id, user.email);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: user.emailVerified,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS", 401);
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);

  if (!valid) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS", 401);
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: user.emailVerified,
  };
}

export async function sendEmailOTP(userId: string, email: string) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + EMAIL_OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.oTP.create({
    data: {
      userId,
      code,
      type: "EMAIL_VERIFY",
      expiresAt,
    },
  });

  await sendOtpEmail(email, code, "EMAIL_VERIFY");

  return { sent: true };
}

export async function verifyEmailOTP(userId: string, code: string) {
  const otp = await prisma.oTP.findFirst({
    where: {
      userId,
      code,
      type: "EMAIL_VERIFY",
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    throw new AuthError("Invalid or expired OTP", "INVALID_OTP", 400);
  }

  await prisma.$transaction([
    prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    }),
  ]);

  return { verified: true };
}

export async function verifyEmailOTPByEmail(email: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AuthError("User not found", "USER_NOT_FOUND", 404);
  }

  return verifyEmailOTP(user.id, code);
}

export async function resendEmailOTP(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AuthError("User not found", "USER_NOT_FOUND", 404);
  }

  if (user.emailVerified) {
    throw new AuthError("Email already verified", "ALREADY_VERIFIED", 400);
  }

  return sendEmailOTP(user.id, user.email);
}

export async function sendPasswordResetOTP(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Avoid leaking whether email exists
    return { sent: true };
  }

  const code = generateOtpCode();
  const expiresAt = new Date(
    Date.now() + PASSWORD_RESET_OTP_EXPIRY_MINUTES * 60 * 1000,
  );

  await prisma.oTP.create({
    data: {
      userId: user.id,
      code,
      type: "PASSWORD_RESET",
      expiresAt,
    },
  });

  await sendOtpEmail(user.email, code, "PASSWORD_RESET");

  return { sent: true };
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AuthError("Invalid or expired OTP", "INVALID_OTP", 400);
  }

  const otp = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      code,
      type: "PASSWORD_RESET",
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    throw new AuthError("Invalid or expired OTP", "INVALID_OTP", 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
  ]);

  return { reset: true };
}
