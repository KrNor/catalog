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

export const editProduct = async (
  id: string,
  object: ProductType
): Promise<ProductDocument | null> => {
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

  const editedProduct = await Product.findByIdAndUpdate(id, object, {
    new: true,
  });
  return editedProduct;
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
    "name price availability descriptionShort category id"
  );
  return allProducts;
};

import { PageObject } from "../types";

type SortObject = { [key: string]: 1 | -1 };

const sortObjectReturner = (sortName: string): SortObject => {
  switch (sortName) {
    case "newest":
      return { _id: -1 };
    case "oldest":
      return { _id: 1 };
    case "priceAsc":
      return { price: 1 };
    case "priceDesc":
      return { price: -1 };
    case "nameAZ":
      return { name: 1 };
    case "nameZA":
      return { name: -1 };
    default:
      return { _id: -1 };
  }
};

interface SimplifiedProductsWithPaginationMeta {
  data: ProductDocument[];
  currentPage: number;
  productCount: number;
  resultsPerPage: number;
}

export const getFilteredSimplifiedProducts = async (
  filter: FilterQuery<ProductDocument>,
  sortingType?: string,
  pagingObject?: PageObject
): Promise<SimplifiedProductsWithPaginationMeta> => {
  const optionsObj = pagingObject
    ? {
        skip: (pagingObject.currentPage - 1) * pagingObject.resultsPerPage,
        limit: pagingObject.resultsPerPage,
      }
    : {
        // change later
        skip: 0,
        limit: 60,
      };
  if (filter && "category" in filter) {
    if (sortingType) {
      const listOfCategories = await getCategoryListUnique(filter.category);
      const filteredProducts = await Product.find(
        {
          ...filter,
          category: { $in: listOfCategories },
        },
        "name price availability descriptionShort category id",
        optionsObj
      )
        .sort(sortObjectReturner(sortingType))
        .collation({ locale: "en", strength: 2 });
      const productCount = await Product.countDocuments({
        ...filter,
        category: { $in: listOfCategories },
      });

      return {
        data: filteredProducts,
        currentPage: pagingObject?.currentPage || 1,
        productCount: productCount,
        resultsPerPage: optionsObj.limit,
      };
    } else {
      const listOfCategories = await getCategoryListUnique(filter.category);
      const filteredProducts = await Product.find(
        {
          ...filter,
          category: { $in: listOfCategories },
        },
        "name price availability descriptionShort category id",
        optionsObj
      );

      const productCount = await Product.countDocuments({
        ...filter,
        category: { $in: listOfCategories },
      });

      return {
        data: filteredProducts,
        currentPage: pagingObject?.currentPage || 1,
        productCount: productCount,
        resultsPerPage: optionsObj.limit,
      };
    }
  } else {
    if (sortingType) {
      const filteredProducts = await Product.find(
        filter,
        "name price availability descriptionShort category id",
        optionsObj
      )
        .sort(sortObjectReturner(sortingType))
        .collation({ locale: "en", strength: 2 });

      const productCount = await Product.countDocuments(filter);

      return {
        data: filteredProducts,
        currentPage: pagingObject?.currentPage || 1,
        productCount: productCount,
        resultsPerPage: optionsObj.limit,
      };
    } else {
      const filteredProducts = await Product.find(
        filter,
        "name price availability descriptionShort category id",
        optionsObj
      );

      const productCount = await Product.countDocuments(filter);

      return {
        data: filteredProducts,
        currentPage: pagingObject?.currentPage || 1,
        productCount: productCount,
        resultsPerPage: optionsObj.limit,
      };
    }
  }
};

export const getProductById = async (
  idOfProduct: string
): Promise<ProductDocument | null> => {
  const wantedProduct = await Product.findById<ProductDocument>(
    idOfProduct,
    "name price availability identifier descriptionShort descriptionLong category tags id"
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
