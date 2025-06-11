import { Request, Response, NextFunction } from "express";
import { zodTagInsideProduct, TagInsideProduct } from "../types";

export const tagParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const returnedTag = zodTagInsideProduct.parse(req.body);
    req.body = returnedTag as TagInsideProduct;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
