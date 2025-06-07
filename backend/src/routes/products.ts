import express from "express";

// getAllProducts,

import {
  createProduct,
  // getAllSimplifiedProducts,
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

import { tagParser } from "../middleware/tagMiddleware";
import { getCategoryById } from "../services/categoryService";

import { errorMiddleware } from "../middleware/errorMiddleware";

const router = express.Router();

router.post("/:id/tag", productIdParser, tagParser, async (req, res) => {
  const objAfterAddedTag = await addTagToProduct(req.params.id, req.body);
  // console.log(newUser);
  res.json(objAfterAddedTag);
});

router.delete("/:id/tag", productIdParser, tagParser, async (req, res) => {
  const objAfterremovedTag = await removeTagFromProduct(
    req.params.id,
    req.body
  );
  // console.log(newUser);
  res.json(objAfterremovedTag);
});

router.post("/", newProductParser, async (req, res) => {
  const newProduct = await createProduct(req.body);
  // console.log(newUser);
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
      if (gottenCategory) {
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

router.get("/:id", productIdParser, async (req, res) => {
  const gottenProduct = await getProductById(req.params.id);
  if (!gottenProduct) {
    res.status(400).json({ error: "product with provided id was not found" });
  } else {
    res.json(gottenProduct);
  }
});

router.get("/", parseQueryAdvanced, async (req: any, res) => {
  const filter = req.mongoFilter || {};
  // console.log(filter);
  const products = await getFilteredSimplifiedProducts(filter);
  res.json(products);
});

router.delete("/:id", productIdParser, async (req, res) => {
  const deletedProduct = await deleteProduct(req.params.id);
  // console.log(deletedProduct);
  if (!deletedProduct) {
    res.status(400).json({ error: "product with provided id was not found" });
  } else {
    res.json(deletedProduct);
  }
});

router.use(errorMiddleware);

export default router;
