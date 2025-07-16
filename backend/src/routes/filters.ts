import express from "express";

import { getFilteredTagsWithCount } from "../services/filterService";
import { parseSidebarFilter } from "../middleware/filterMiddleware";
import { RequestWithSidebarFilter } from "../types";

const router = express.Router();

router.get(
  "/sidebar",
  parseSidebarFilter,
  async (req: RequestWithSidebarFilter, res) => {
    if (req.productFilter) {
      const products = await getFilteredTagsWithCount(req.productFilter);
      res.json(products);
    } else {
      const products = await getFilteredTagsWithCount({});
      res.json(products);
    }
  }
);

export default router;
