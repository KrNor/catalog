import express from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getProductsByCategory,
  getCategoryLineageImediateChildren,
  getBaseCategories,
  updateCategory,
} from "../services/categoryService";
import {
  newCategoryParser,
  categoryIdParser,
  updatingCategoryParser,
} from "../middleware/categoryMiddleware";

import {
  authenticateToken,
  authenticateAdmin,
} from "../middleware/authMiddleware";

const router = express.Router();

router.get("/base", async (_req, res) => {
  const gottenCategory = await getBaseCategories();
  if (!gottenCategory) {
    res.status(400).json({
      error: "something went wrong with the request, try again later",
    });
  } else {
    res.json(gottenCategory);
  }
});

router.get("/base/:id", categoryIdParser, async (req, res) => {
  const gottenCategory = await getCategoryLineageImediateChildren(
    req.params.id
  );
  if (!gottenCategory) {
    res.status(400).json({ error: "category with provided id was not found" });
  } else {
    res.json(gottenCategory);
  }
});

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

router.use(authenticateToken, authenticateAdmin);

router.get("/", async (_req, res) => {
  const category = await getAllCategories();
  res.json(category);
});

router.post("/", newCategoryParser, async (req, res, next) => {
  try {
    const newCategory = await createCategory(req.body);
    res.json(newCategory);
  } catch (error: unknown) {
    next(error);
  }
});

router.post(
  "/:id",
  categoryIdParser,
  updatingCategoryParser,
  async (req, res, next) => {
    try {
      if (req.body.description) {
        const updatedCategory = await updateCategory(
          req.params.id,
          req.body.description
        );
        res.json(updatedCategory);
      } else {
        res
          .status(400)
          .json({ error: "there is nothing to update in this category" });
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);

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
