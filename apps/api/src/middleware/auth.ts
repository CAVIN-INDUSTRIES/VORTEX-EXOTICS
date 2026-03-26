import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing or invalid token" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ code: "CONFIG_ERROR", message: "JWT_SECRET not configured" });
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}

/**
 * Like requireAuth but does NOT 401 when no token is provided.
 * Populates `req.user` if a valid Bearer token is present; otherwise leaves it undefined.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = process.env.JWT_SECRET;

  if (token && secret) {
    try {
      req.user = jwt.verify(token, secret) as AuthPayload;
    } catch {
      // invalid/expired token — proceed as unauthenticated
    }
  }
  next();
}
