import { Request, Response, NextFunction } from "express";
import { zodProduct } from "../types";
import mongoose from "mongoose";

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

export const categoryIdParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.params.category &&
      typeof req.params.category === "string" &&
      mongoose.isValidObjectId(req.params.category)
    ) {
      next();
    } else {
      throw new Error("bad category id");
    }
  } catch (error: unknown) {
    next(error);
  }
};
