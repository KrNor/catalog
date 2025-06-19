import express from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getProductsByCategory,
} from "../services/categoryService";
import {
  newCategoryParser,
  categoryIdParser,
} from "../middleware/categoryMiddleware";

import {
  authenticateToken,
  authenticateAdmin,
} from "../middleware/authMiddleware";

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
  const category = await getAllCategories();
  res.json(category);
});

router.use(authenticateToken, authenticateAdmin);

router.post("/", newCategoryParser, async (req, res, next) => {
  try {
    const newCategory = await createCategory(req.body);
    res.json(newCategory);
  } catch (error: unknown) {
    next(error);
  }
});

router.delete("/:id", categoryIdParser, async (req, res, next) => {
  try {
    const deletedCategory = await deleteCategory(req.params.id);
    if (!deletedCategory) {
      res
        .status(400)
        .json({ error: "category with provided id was not deleted" });
    } else {
      res.status(200).json(deletedCategory);
    }
  } catch (error: unknown) {
    next(error);
  }
});

export default router;
