import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user";
import { zodUserLogin } from "../types";
import { JWT_SECRET, COOKIE_NAME, cookieOptions } from "../config/auth";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const validationResult = zodUserLogin.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.flatten() });
      return;
    }
    const { username, password } = validationResult.data;

    const user: UserDocument = await User.findOne({ username }).select(
      "+passwordHash"
    );

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // JWT creation
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie(COOKIE_NAME, token, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
        },
      });
  } catch (error: unknown) {
    next(error);
  }
});
router.post("/logout", async (_req, res, next) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: unknown) {
    next(error);
  }
});

router.get(
  "/check",
  authenticateToken,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ user });
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default router;
