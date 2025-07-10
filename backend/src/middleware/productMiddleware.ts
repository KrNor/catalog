import { Request, Response, NextFunction } from "express";
import { zodProduct, zodProductFilter, RequestWithFilter } from "../types";
import mongoose from "mongoose";
import { FilterQuery } from "mongoose";
import { ProductDocument } from "../models/product";

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

export const parseQueryAdvanced = (
  req: RequestWithFilter,
  res: Response,
  next: NextFunction
) => {
  const parseResult = zodProductFilter.safeParse(req.query);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten() });
    return;
  }

  const {
    minPrice,
    maxPrice,
    search,
    availability,
    category,
    sortType,
    currentPage,
    resultsPerPage,
  } = parseResult.data;

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

  // sorting

  let sortingTypeResult = "";
  if (sortType) {
    if (
      [
        "newest",
        "oldest",
        "priceAsc",
        "priceDesc",
        "nameAZ",
        "nameZA",
      ].includes(sortType)
    ) {
      sortingTypeResult = sortType;
    } else {
      sortingTypeResult = "newest"; // default sort
    }
  }

  req.sortingType = sortingTypeResult;

  // paging

  let currentPageResult = undefined,
    resultsPerPageResult = undefined;

  if (currentPage || resultsPerPage) {
    currentPageResult = currentPage || 1;
    resultsPerPageResult = resultsPerPage || 60;
  }

  if (currentPageResult && resultsPerPageResult) {
    req.pagingObject = {
      currentPage: currentPageResult,
      resultsPerPage: resultsPerPageResult,
    };
  } else {
    req.pagingObject = {
      currentPage: 1,
      resultsPerPage: 60,
    };
  }
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
