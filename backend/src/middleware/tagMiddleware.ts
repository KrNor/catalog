import { Request, Response, NextFunction } from "express";
import { zodTagToSave } from "../types";

export const tagParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const returnedTag = zodTagToSave.parse(req.body);
    req.body = returnedTag;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
