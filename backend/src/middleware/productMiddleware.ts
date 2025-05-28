import { Request, Response, NextFunction } from "express";
import { zodProduct } from "../types";
import mongoose from "mongoose";
import z from "zod";

export const newProductParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const returnedProduct = zodProduct.parse(req.body);
    req.body = returnedProduct;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const productIdParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.params.id &&
      typeof req.params.id === "string" &&
      mongoose.isValidObjectId(req.params.id)
    ) {
      next();
    } else {
      throw new Error("bad product id");
    }
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else if (error instanceof Error) {
    res.status(400).send({ error: error.message });
  } else {
    next(error);
  }
};
