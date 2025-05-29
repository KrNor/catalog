import Product from "../models/product";
import { getCategoryById } from "./categoryService";
// import Category from "../models/category";
import { zodProductType } from "../types";
export const createProduct = async (object: zodProductType) => {
  const productToSave = {
    ...object,
  };
  if (productToSave.category) {
    const wantedCategory = await getCategoryById(productToSave.category);
    if (!wantedCategory) {
      throw new Error("specified category doesn't exist");
    }
  }
  const new_product = new Product(productToSave);
  await new_product.save();
  return new_product;
};

export const getAllProducts = async () => {
  const allProducts = await Product.find({});
  return allProducts;
};

export const getProductById = async (idOfProduct: string) => {
  const wantedProduct = await Product.findById(idOfProduct).exec();
  // console.log(wantedProduct);
  return wantedProduct;
};

export const deleteProduct = async (idOfProduct: string) => {
  const wantedProduct = await Product.findByIdAndDelete(idOfProduct).exec();
  return wantedProduct;
};
