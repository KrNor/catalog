import express from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getProductsByCategory,
} from "../services/categoryService";
import { errorMiddleware } from "../middleware/errorMiddleware";
import {
  newCategoryParser,
  categoryIdParser,
} from "../middleware/categoryMiddleware";

const router = express.Router();

router.get("/:id/products", categoryIdParser, async (req, res) => {
  const gottenCategory = await getProductsByCategory(req.params.id);
  if (!gottenCategory) {
    res.status(400).json({ error: "category with provided id was not found" });
  } else {
    res.json(gottenCategory);
  }
});

router.get("/:id", categoryIdParser, async (req, res) => {
  const gottenCategory = await getCategoryById(req.params.id);
  if (!gottenCategory) {
    res.status(400).json({ error: "category with provided id was not found" });
  } else {
    res.json(gottenCategory);
  }
});

router.get("/", async (_req, res) => {
  const products = await getAllCategories();
  res.json(products);
});

router.post("/", newCategoryParser, async (req, res) => {
  const newProduct = await createCategory(req.body);
  res.json(newProduct);
});

router.delete("/:id", categoryIdParser, async (req, res) => {
  const deletedCategory = await deleteCategory(req.params.id);
  // console.log(deletedProduct);
  if (!deletedCategory) {
    res
      .status(400)
      .json({ error: "category with provided id was not deleted" });
  } else {
    res.json(deletedCategory);
  }
});

router.use(errorMiddleware);

export default router;
