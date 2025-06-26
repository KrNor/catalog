import { Request, Response, NextFunction } from "express";
import { zodCategory, UpdateCategoryZodSchema } from "../types";
import mongoose from "mongoose";

export const newCategoryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const returnedCategory = zodCategory.parse(req.body);
    req.body = returnedCategory;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const updatingCategoryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const returnedCategory = UpdateCategoryZodSchema.parse(
      req.body.description
    );
    req.body.description = returnedCategory;
    next();
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
      req.params.id &&
      typeof req.params.id === "string" &&
      mongoose.isValidObjectId(req.params.id)
    ) {
      next();
    } else {
      throw new Error("bad category id");
    }
  } catch (error: unknown) {
    next(error);
  }
};
