import express from "express";
import {
  createProduct,
  editProduct,
  getProductById,
  deleteProduct,
  addTagToProduct,
  removeTagFromProduct,
  getFilteredSimplifiedProducts,
} from "../services/productService";
import {
  newProductParser,
  productIdParser,
  categoryIdParser,
  parseQueryAdvanced,
} from "../middleware/productMiddleware";
import {
  authenticateToken,
  authenticateAdmin,
} from "../middleware/authMiddleware";

import { tagParser } from "../middleware/tagMiddleware";
import { getCategoryById } from "../services/categoryService";
import { RequestWithFilter } from "../types";

const router = express.Router();

router.get("/:id", productIdParser, async (req, res) => {
  const gottenProduct = await getProductById(req.params.id);
  if (!gottenProduct) {
    res.status(400).json({ error: "product with provided id was not found" });
  } else {
    res.json(gottenProduct);
  }
});

router.get("/", parseQueryAdvanced, async (req: RequestWithFilter, res) => {
  if (
    req.productFilter !== undefined &&
    req.sortingType !== undefined &&
    req.pagingObject !== undefined
  ) {
    const products = await getFilteredSimplifiedProducts(
      req.productFilter,
      req.sortingType,
      req.pagingObject
    );
    res.json(products);
  } else {
    const products = await getFilteredSimplifiedProducts({});
    res.json(products);
  }
});

router.use(authenticateToken, authenticateAdmin);

router.post("/:id/tag", productIdParser, tagParser, async (req, res) => {
  const objAfterAddedTag = await addTagToProduct(req.params.id, req.body);
  res.json(objAfterAddedTag);
});

router.delete("/:id/tag", productIdParser, tagParser, async (req, res) => {
  const objAfterremovedTag = await removeTagFromProduct(
    req.params.id,
    req.body
  );
  res.json(objAfterremovedTag);
});

router.post("/", newProductParser, async (req, res) => {
  const newProduct = await createProduct(req.body);
  res.json(newProduct);
});

router.post(
  "/:id/:category",
  productIdParser,
  categoryIdParser,
  async (req, res) => {
    const gottenProduct = await getProductById(req.params.id);
    if (!gottenProduct) {
      res.status(400).json({ error: "product with provided id was not found" });
    } else {
      const gottenCategory = await getCategoryById(req.params.category);
      if (!(gottenCategory === null)) {
        gottenProduct.category = gottenCategory.id;
        await gottenProduct.save();
        res.json(gottenProduct);
      } else {
        res
          .status(400)
          .json({ error: "category with the provided id was not found" });
      }
    }
  }
);

router.post("/:id", productIdParser, newProductParser, async (req, res) => {
  const editedProduct = await editProduct(req.params.id, req.body);
  if (!(editedProduct === null)) {
    res.json(editedProduct);
  } else {
    res.status(400).json({ error: "product edit failed" });
  }
});

router.delete("/:id", productIdParser, async (req, res) => {
  const deletedProduct = await deleteProduct(req.params.id);
  if (!deletedProduct) {
    res.status(400).json({ error: "product with provided id was not found" });
  } else {
    res.json(deletedProduct);
  }
});

export default router;
