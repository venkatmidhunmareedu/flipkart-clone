import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export type AccessTokenPayload = {
  id: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, getJwtSecret()) as AccessTokenPayload;
}
