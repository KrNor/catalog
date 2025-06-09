import Product from "../models/product";
import { getCategoryById, getCategoryListUnique } from "./categoryService";
import { createTag } from "./tagService";
import { zodProductType, zodTagToSaveType } from "../types";

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

  if (!(productToSave.tags === undefined)) {
    productToSave.tags.forEach(async (tagg) => {
      if (!(tagg === undefined)) {
        const returnedTag = await createTag(tagg);
        if (returnedTag.tagName) {
          return {
            tagName: returnedTag.tagName,
            tagAttribute: tagg.tagAttribute,
          };
        } else {
          return tagg;
        }
      } else {
        throw new Error("something went wrong related to product and tags");
      }
    });
  }
  const newProduct = new Product(productToSave);
  await newProduct.save();
  return newProduct;
};

export const getAllProducts = async () => {
  const allProducts = await Product.find(
    {},
    "name price avaliability identifier descriptionShort descriptionLong category tags id "
  );
  return allProducts;
};

export const getAllSimplifiedProducts = async () => {
  const allProducts = await Product.find(
    {},
    "name price avaliability descriptionShort category id "
  );
  return allProducts;
};

export const getFilteredSimplifiedProducts = async (
  filter: Record<string, any>
) => {
  if ("category" in filter) {
    const listOfCategories = await getCategoryListUnique(filter.category);
    const filteredProducts = await Product.find(
      {
        ...filter,
        category: { $in: listOfCategories },
      },
      "name price avaliability descriptionShort category id "
    );
    return filteredProducts;
  } else {
    // console.log(filter);
    const filteredProducts = await Product.find(
      filter,
      "name price avaliability descriptionShort category id "
    );
    return filteredProducts;
  }
};

export const getProductById = async (idOfProduct: string) => {
  const wantedProduct = await Product.findById(
    idOfProduct,
    "name price avaliability identifier descriptionShort descriptionLong category tags idname price avaliability id"
  ).exec();
  return wantedProduct;
};

export const deleteProduct = async (idOfProduct: string) => {
  const wantedProduct = await Product.findByIdAndDelete(idOfProduct).exec();
  return wantedProduct;
};

export const addTagToProduct = async (
  idOfProduct: string,
  tagObject: zodTagToSaveType
) => {
  const wantedProduct = await Product.findById(idOfProduct).exec();

  if (wantedProduct) {
    const tagsss = await wantedProduct.tags.find(
      (taggss) => taggss.tagName === tagObject.tagName
    );
    if (tagsss) {
      tagsss.tagAttribute = tagObject.tagAttribute;
    } else {
      // await createTag(tagObject);
      wantedProduct.tags.push(tagObject);
    }
    await createTag(tagObject);
    await wantedProduct.save();
  }

  return wantedProduct;
};
export const removeTagFromProduct = async (
  idOfProduct: string,
  tagObject: zodTagToSaveType
) => {
  const wantedProduct = await Product.findByIdAndUpdate(
    idOfProduct,
    { $pull: { tags: { tagName: tagObject.tagName } } },
    { new: true }
  );

  return wantedProduct;
};
