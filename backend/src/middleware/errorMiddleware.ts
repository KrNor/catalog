import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import z from "zod";
import jwt from "jsonwebtoken";

export const zodErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues[0].message });
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
  if (
    error instanceof mongoose.Error ||
    error instanceof mongoose.mongo.MongoError
  ) {
    switch (error.name) {
      case "CastError":
        res.status(400).send({ error: "Badly typed id" });
        return;
      case "ValidationError":
        res.status(400).send({ error: "Failed to validate the request" });
        return;
      case "MongoServerError":
        if (error.message.includes("E11000 duplicate key error")) {
          res
            .status(400)
            .send({ error: "An expected unique value was not unique" });
        } else {
          res.status(400).send({ error: "Unknown database error" });
        }
        return;
      case "JsonWebTokenError":
        res.status(401).json({
          error: "Invalid token",
        });
        return;
      case "TokenExpiredError":
        res.status(401).json({ error: "Token expired" });
        return;

      default:
        res.status(400).json({
          error: "Unknown database error",
        });
        return;
    }
  } else {
    next(error);
  }
};

export const jwtErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof jwt.TokenExpiredError) {
    res.status(401).json({ error: "Token expired" });
  } else if (error instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ error: "Invalid token" });
  } else {
    next(error);
  }
};

export const genericErrorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  // do not remove _next
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (error instanceof Error) {
    res.status(400).send({ error: error.message });
    return;
  } else {
    res.status(400).send({ error: "Unknown error" });
    return;
  }
};
