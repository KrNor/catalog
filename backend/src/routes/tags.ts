import express from "express";

import {
  createTag,
  getAllTags,
  deleteTag,
  getTagByName,
} from "../services/tagService";
import { tagParser } from "../middleware/tagMiddleware";

const router = express.Router();

router.get("/:name", async (req, res) => {
  const gottenProduct = await getTagByName(req.params.name);
  if (!gottenProduct) {
    res.status(400).json({ error: "wanted tag was not found" });
  } else {
    res.json(gottenProduct);
  }
});

router.post("/", tagParser, async (req, res) => {
  const newProduct = await createTag(req.body);
  res.json(newProduct);
});

router.get("/", async (_req, res) => {
  const products = await getAllTags();
  res.json(products);
});

router.delete("/", tagParser, async (req, res) => {
  const deletedTag = await deleteTag(req.body);
  if (!deletedTag) {
    res.status(400).json({ error: "something went wrong with tag deletion" });
  } else {
    res.json(deletedTag);
  }
});

export default router;
