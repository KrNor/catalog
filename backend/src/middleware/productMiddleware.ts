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

const allowedFields = [
  "minPrice",
  "maxPrice",
  "search",
  "avaliability",
  "category",
];

// todo: find alternative to this
export const parseQueryAdvanced = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const query = req.query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  const rangeMap: Record<string, { field: string; op: "$gte" | "$lte" }> = {
    minPrice: { field: "price", op: "$gte" },
    maxPrice: { field: "price", op: "$lte" },
    avaliability: { field: "avaliability", op: "$gte" },
  };

  Object.entries(query).forEach(([key, rawValue]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = rawValue;

    if (typeof value === "string") {
      if (value == "") return;
      else if (
        !isNaN(Number(value)) &&
        !(key === "search" || key === "category")
      )
        value = Number(value);
    }

    // Handle range queries
    if (key in rangeMap) {
      const { field, op } = rangeMap[key];
      if (!filter[field]) filter[field] = {};
      filter[field][op] = value;
      return;
    }

    // Handle normal allowed fields
    if (allowedFields.includes(key)) {
      if (key === "search") {
        filter["name"] = new RegExp(value, "i");
      } else {
        filter[key] = value;
      }
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).mongoFilter = filter;
  next();
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
