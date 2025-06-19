import Product, { ProductDocument } from "../models/product";
import { getCategoryById, getCategoryListUnique } from "./categoryService";
import { createTag } from "./tagService";
import { ProductType, TagInsideProduct } from "../types";
import { FilterQuery } from "mongoose";

export const createProduct = async (
  object: ProductType
): Promise<ProductDocument> => {
  if (object.category) {
    const wantedCategory = await getCategoryById(object.category);
    if (!wantedCategory) {
      throw new Error("specified category doesn't exist");
    }
  }

  if (!(object.tags === undefined)) {
    object.tags.forEach(async (tagg) => {
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
  const newProduct: ProductDocument = new Product(object);
  await newProduct.save();
  return newProduct;
};

export const getAllProducts = async (): Promise<ProductDocument[]> => {
  const allProducts: ProductDocument[] = await Product.find({});
  return allProducts;
};

export const getAllSimplifiedProducts = async (): Promise<
  ProductDocument[]
> => {
  const allProducts: ProductDocument[] = await Product.find(
    {},
    "name price avaliability descriptionShort category id "
  );
  return allProducts;
};

export const getFilteredSimplifiedProducts = async (
  filter: FilterQuery<ProductDocument>
): Promise<ProductDocument[]> => {
  if (filter && "category" in filter) {
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
    const filteredProducts = await Product.find(
      filter,
      "name price avaliability descriptionShort category id "
    );
    return filteredProducts;
  }
};

export const getProductById = async (
  idOfProduct: string
): Promise<ProductDocument | null> => {
  const wantedProduct = await Product.findById<ProductDocument>(
    idOfProduct,
    "name price avaliability identifier descriptionShort descriptionLong category tags idname price avaliability id"
  ).exec();
  return wantedProduct;
};

export const deleteProduct = async (
  idOfProduct: string
): Promise<ProductDocument | null> => {
  const wantedProduct = await Product.findByIdAndDelete(idOfProduct).exec();
  return wantedProduct;
};

export const addTagToProduct = async (
  idOfProduct: string,
  tagObject: TagInsideProduct
): Promise<ProductDocument | null> => {
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
  tagObject: TagInsideProduct
): Promise<ProductDocument | null> => {
  const wantedProduct = await Product.findByIdAndUpdate<ProductDocument>(
    idOfProduct,
    { $pull: { tags: { tagName: tagObject.tagName } } },
    { new: true }
  );

  return wantedProduct;
};
