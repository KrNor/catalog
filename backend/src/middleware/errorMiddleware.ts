import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import z from "zod";

export const zodErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

export const mongooseErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof mongoose.Error) {
    if (error.name === "CastError") {
      res.status(400).send({ error: "malformatted id" });
      return;
    } else if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    } else if (
      error.name === "MongoServerError" &&
      error.message.includes("E11000 duplicate key error")
    ) {
      res.status(400).json({
        error: "expected `username` to be unique",
      });
      return;
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        error: "invalid token",
      });
      return;
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "token expired" });
      return;
    }
  }
  next(error);
};

export const genericErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error) {
    res.status(400).send({ error: error.message });
    return;
  } else {
    next(error);
  }
};
