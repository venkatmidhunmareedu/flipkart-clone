import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      error: { message: "Unauthorized", code: "UNAUTHORIZED" },
    });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({
      error: { message: "Invalid or expired token", code: "INVALID_TOKEN" },
    });
  }
}
