import express from "express";
const router = express.Router();

import {
  getSignedUrlForUpload,
  getImageUploadInfo,
} from "../services/imageService";
import { parseCloudinaryOptions } from "../middleware/imageMiddleware";
import {
  authenticateToken,
  authenticateAdmin,
} from "../middleware/authMiddleware";

import { RequestWithCloudinaryOptions } from "../types";

router.use(authenticateToken, authenticateAdmin);

router.get("/info", (_req, res) => {
  const products = getImageUploadInfo();
  res.json(products);
});

router.get(
  "/signature",
  parseCloudinaryOptions,
  async (req: RequestWithCloudinaryOptions, res) => {
    if (req.cloudinaryOptions) {
      const products = await getSignedUrlForUpload(req.cloudinaryOptions);
      res.json(products);
    } else {
      res.status(400).json({
        error: "something is wrong with the provided signature request",
      });
    }
  }
);

export default router;
