import Product from "../models/product";
import { zodProductType, zodProduct } from "../types";
export const createProduct = async (object: zodProductType) => {
  const productToSave = {
    ...object,
  };
  // console.log(productToSave);
  const new_product = new Product(productToSave);
  await new_product.save();
  // console.log(new_product);
  return new_product;
};

export const getAllProducts = async () => {
  const allProducts = await Product.find({});
  return allProducts;
};

export const getProductById = async (idOfProduct: string) => {
  // saving just in case
  //("name price avaliability Identifier descriptionShort descriptionLong categoryArray");
  const wantedProduct = await Product.findById(
    idOfProduct,
    "name price avaliability Identifier descriptionShort descriptionLong categoryArray"
  ).exec();
  if (!wantedProduct) {
    return wantedProduct;
  } else {
    const parsedProduct = zodProduct.parse(wantedProduct);
    return parsedProduct;
  }
};

export const deleteProduct = async (idOfProduct: string) => {
  const wantedProduct = await Product.findByIdAndDelete(idOfProduct).exec();
  if (!wantedProduct) {
    return wantedProduct;
  } else {
    const parsedProduct = zodProduct.parse(wantedProduct);
    return parsedProduct;
  }
};
