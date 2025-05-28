import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../services/productService";
import {
  newProductParser,
  productIdParser,
  errorMiddleware,
} from "../middleware/productMiddleware";

const router = express.Router();

router.get("/:id", productIdParser, async (req, res) => {
  const gottenProduct = await getProductById(req.params.id);
  if (!gottenProduct) {
    res.status(400).json({ error: "product with provided id was not found" });
  } else {
    res.json(gottenProduct);
  }
});

router.get("/", async (_req, res) => {
  const products = await getAllProducts();
  // console.log(products);
  res.json(products);
});

router.post("/", newProductParser, async (req, res) => {
  const newProduct = await createProduct(req.body);
  // console.log(newUser);
  res.json(newProduct);
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
