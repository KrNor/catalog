import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, COOKIE_NAME } from "../config/auth";
import mongoose from "mongoose";
import User from "../models/user";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: "admin" | "user";
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const isLoggedInCookie = req.cookies["isLoggedIn"];

    if (
      !isLoggedInCookie ||
      !(typeof isLoggedInCookie === "string") ||
      !(isLoggedInCookie === "true")
    ) {
      res.status(401).json({ error: "Cookie confirmation missing" });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: "admin" | "user";
      iat: number;
      exp: number;
    };

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole || !(userRole === "admin")) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    if (!mongoose.isValidObjectId(userId)) {
      res.status(401).json({ error: "Bad user id" });
      return;
    }

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (!(foundUser.role === "admin")) {
      res.status(404).json({ error: "User is not an admin" });
      return;
    }

    req.user = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };
    next();
  } catch (error: unknown) {
    next(error);
  }
};
