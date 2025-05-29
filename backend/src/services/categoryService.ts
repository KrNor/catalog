import Category from "../models/category";
import Product from "../models/product";
import { zodCategoryType } from "../types";
export const createCategory = async (object: zodCategoryType) => {
  const categoryToSave = {
    ...object,
  };
  if (object.parent) {
    const parentCategory = await getCategoryById(object.parent);
    if (
      parentCategory &&
      parentCategory.id &&
      parentCategory.lineage.length > 0
    ) {
      categoryToSave.lineage = [...parentCategory.lineage, parentCategory.id];
    } else if (parentCategory && parentCategory.id) {
      categoryToSave.lineage = [parentCategory.id];
    } else {
      throw new Error("The specified Category parent does not exist");
    }
  }

  //   console.log(categoryToSave);

  const new_category = new Category(categoryToSave);

  await new_category.save();
  //   console.log(new_category);
  return new_category;
};

export const getCategoryById = async (idOfCategory: string) => {
  const wantedCategory = await Category.findById(idOfCategory).exec();
  //   console.log(wantedCategory);
  return wantedCategory;
};

export const getAllCategories = async () => {
  const allCategories = await Category.find({});
  return allCategories;
};

export const deleteCategory = async (idOfCategory: string) => {
  const categoryWithChildren = await Category.findOne({
    lineage: idOfCategory,
  });
  //   console.log(categoryWithChildren);
  if (categoryWithChildren) {
    throw new Error(
      `category can't be deleted,all children categories must be deleted first, delete: '${categoryWithChildren.name}'`
    );
  }
  const wantedCategory = await Category.findByIdAndDelete(idOfCategory).exec();
  return wantedCategory;
};
export const getProductsByCategory = async (idOfCategory: string) => {
  const categoryParents = await Category.find({
    lineage: idOfCategory,
  });

  const uniqueCategoryIds: string[] = [
    ...new Set(categoryParents.map((category) => category._id.toString())),
  ];

  const listOfCategories = [...uniqueCategoryIds, idOfCategory];

  const products = await Product.find({
    category: { $in: listOfCategories },
  });
  return products;
};
