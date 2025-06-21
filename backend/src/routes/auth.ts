import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user";
import { zodUserLogin } from "../types";
import {
  JWT_SECRET,
  COOKIE_NAME,
  cookieOptions,
  isLoggedInCookieOptions,
} from "../config/auth";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const validationResult = zodUserLogin.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({ error: "badly formated login request" });
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
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    // isLoggedIn cookie for knowing if user is logged in

    res
      .cookie(COOKIE_NAME, token, cookieOptions)
      .cookie("isLoggedIn", true, isLoggedInCookieOptions)
      .status(200)
      .json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
  } catch (error: unknown) {
    next(error);
  }
});
router.post("/logout", async (_req, res, next) => {
  try {
    res
      .clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .clearCookie("isLoggedIn", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

    res.status(200).json({ error: "Logout successful" });
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

      const foundUser = await User.findById(userId);
      if (!foundUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const user = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      };

      res.status(200).json({ user });
    } catch (error: unknown) {
      next(error);
    }
  }
);

export default router;
