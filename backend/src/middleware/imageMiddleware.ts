import { Response, NextFunction } from "express";

import {
  zodCloudinaryOptions,
  RequestWithCloudinaryOptions,
  CloudinaryOptionsType,
} from "../types";

export const parseCloudinaryOptions = (
  req: RequestWithCloudinaryOptions,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseResult = zodCloudinaryOptions.safeParse(req.query);

    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.flatten() });
      return;
    }

    req.cloudinaryOptions = parseResult.data as CloudinaryOptionsType;

    next();
  } catch (error: unknown) {
    next(error);
  }
};
