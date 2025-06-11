import Category, { CategoryDocument } from "../models/category";
import Product from "../models/product";
import { CategoryType } from "../types";
import { Types } from "mongoose";
// import _ from "lodash";

export const createCategory = async (
  object: CategoryType
): Promise<CategoryDocument> => {
  // const categoryToSave: zodCategoryType = {
  //   ...object,
  // };
  if (object.parent) {
    const parentCategory = await getCategoryById(object.parent);
    if (
      parentCategory &&
      parentCategory.id &&
      parentCategory.lineage.length > 0
    ) {
      object.lineage = [...parentCategory.lineage, parentCategory.id];
    } else if (parentCategory && parentCategory.id) {
      object.lineage = [parentCategory.id];
    } else {
      throw new Error("The specified Category parent does not exist");
    }
  }

  const newCategory: CategoryDocument = new Category(object);

  const savedCategory = await newCategory.save();

  return savedCategory;
};

export const getCategoryById = async (
  idOfCategory: string
): Promise<CategoryDocument | null> => {
  const wantedCategory = await Category.findById(idOfCategory).exec();
  return wantedCategory;
};

export const getAllCategories = async (): Promise<CategoryDocument[]> => {
  const allCategories: CategoryDocument[] = await Category.find({});
  return allCategories;
};

export const deleteCategory = async (
  idOfCategory: string
): Promise<CategoryDocument | null> => {
  // I remember testing this but don't thing this should work when I read this
  const categoryWithChildren: CategoryDocument | null = await Category.findOne({
    lineage: idOfCategory,
  });

  //   console.log(categoryWithChildren);
  if (categoryWithChildren) {
    throw new Error(
      `category can't be deleted,all children categories must be deleted first, delete: '${categoryWithChildren.name}'`
    );
  }
  const wantedCategory: CategoryDocument | null =
    await Category.findByIdAndDelete(idOfCategory).exec();
  if (!wantedCategory) {
    throw new Error(`The category you want to delete doesn't exist`);
  }
  return wantedCategory;
};

// after fixing products ?
export const getProductsByCategory = async (idOfCategory: string) => {
  const categoryParents = await Category.find({
    lineage: idOfCategory,
  });

  const uniqueCategoryIds: string[] = [
    ...new Set(
      categoryParents.map((category) => {
        if (category._id instanceof Types.ObjectId) {
          return category._id.toString();
        } else {
          throw new Error(
            "something went horribly wrong related to categry id's not being object id's"
          );
        }
      })
    ),
  ];

  const listOfCategories = [...uniqueCategoryIds, idOfCategory];

  const products = await Product.find({
    category: { $in: listOfCategories },
  });
  return products;
};

export const getCategoryListUnique = async (
  idOfCategory: string
): Promise<string[]> => {
  const categoryParents: CategoryDocument[] = await Category.find({
    lineage: idOfCategory,
  });
  const uniqueCategoryIds: string[] = [
    ...new Set(categoryParents.map((category) => category.id.toString())),
  ];

  const listOfCategories = [...uniqueCategoryIds, idOfCategory];
  return listOfCategories;
};
