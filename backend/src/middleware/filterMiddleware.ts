import { Response, NextFunction } from "express";
import { zodSidebarFilter, RequestWithSidebarFilter } from "../types";
import { FilterQuery } from "mongoose";
import { ProductDocument } from "../models/product";

export const parseSidebarFilter = (
  req: RequestWithSidebarFilter,
  res: Response,
  next: NextFunction
) => {
  const parseResult = zodSidebarFilter.safeParse(req.query);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten() });
    return;
  }

  const { minPrice, maxPrice, search, availability, category } =
    parseResult.data;

  const filterToPass: FilterQuery<ProductDocument> = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    filterToPass.price = {};
    if (minPrice !== undefined) filterToPass.price.$gte = minPrice;
    if (maxPrice !== undefined) filterToPass.price.$lte = maxPrice;
  }

  if (search) {
    filterToPass.name = { $regex: search, $options: "i" };
  }

  if (availability) {
    if (availability === 1) {
      filterToPass.availability = { $gte: 1 };
    }
  }

  if (category) {
    filterToPass.category = category;
  }

  req.productFilter = filterToPass;

  next();
};
