import Category, { CategoryDocument } from "../models/category"; // MongooseCategory
import Product, { ProductDocument } from "../models/product";
import { CategoryType } from "../types";
import { Types } from "mongoose";

interface CategoryToReturn {
  id: string;
  name: string;
}
interface CategoryPastAndFuture {
  lineage: CategoryToReturn[];
  category: CategoryToReturn[];
  imediateChildren: CategoryToReturn[];
}

interface CategoryPastAndFutureWithUnderscore {
  lineage: CategoryToReturnWithUnderscore[];
  imediateChildren: CategoryToReturnWithUnderscore[];
}

interface CategoryToReturnWithUnderscore {
  _id: string;
  name: string;
}

export const createCategory = async (
  object: CategoryType
): Promise<CategoryDocument> => {
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
  const categoryWithChildren: CategoryDocument | null = await Category.findOne({
    lineage: idOfCategory,
  });

  if (categoryWithChildren) {
    throw new Error(
      `Category can't be deleted,all children categories must be deleted first, hint: delete '${categoryWithChildren.name}'`
    );
  }
  const wantedCategory: CategoryDocument | null =
    await Category.findByIdAndDelete(idOfCategory).exec();
  if (!wantedCategory) {
    throw new Error(`The category you want to delete doesn't exist`);
  }
  return wantedCategory;
};

export const getProductsByCategory = async (
  idOfCategory: string
): Promise<ProductDocument[]> => {
  const categoryParents: CategoryDocument[] = await Category.find({
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

  const products: ProductDocument[] = await Product.find({
    category: { $in: listOfCategories },
  });
  return products;
};

// gives back a list of children all children categories from given id category
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

export const getCategoryLineageImediateChildren = async (
  idOfCategory: string
): Promise<CategoryPastAndFuture> => {
  const currentCategory: CategoryDocument | null = await getCategoryById(
    idOfCategory
  );
  if (!currentCategory) {
    throw new Error("sutch category does not exist");
  }

  const result = await Category.aggregate<CategoryPastAndFutureWithUnderscore>([
    {
      $facet: {
        lineage: [
          { $match: { _id: { $in: currentCategory.lineage } } },
          { $project: { _id: 1, name: 1 } },
        ],
        imediateChildren: [
          { $match: { parent: currentCategory._id } },
          { $project: { _id: 1, name: 1 } },
        ],
      },
    },
  ]);

  const removeUnderscore = (
    categoryy: CategoryToReturnWithUnderscore[]
  ): CategoryToReturn[] => {
    const newArray: Array<CategoryToReturn> = [];
    categoryy.forEach((val) => {
      newArray.push({
        id: val._id.toString(),
        name: val.name,
      });
    });
    return newArray;
  };
  const lineageToReturn = removeUnderscore(result[0].lineage);
  const imediateChildrenToReturn = removeUnderscore(result[0].imediateChildren);

  return {
    lineage: lineageToReturn,
    category: [{ id: currentCategory.id, name: currentCategory.name }],
    imediateChildren: imediateChildrenToReturn,
  };
};

export const getBaseCategories = async (): Promise<CategoryPastAndFuture> => {
  const listOfCategories = await Category.find<CategoryToReturn>(
    { parent: null },
    "name id"
  ).exec();

  const BaseCategoriesObject: CategoryPastAndFuture = {
    lineage: [],
    category: [],
    imediateChildren: [...listOfCategories],
  };

  return BaseCategoriesObject;
};

export const updateCategory = async (
  idOfCategory: string,
  newDescription: string
): Promise<CategoryDocument> => {
  const wantedCategory = await Category.findByIdAndUpdate(
    idOfCategory,
    {
      description: newDescription,
    },
    { new: true }
  );
  if (!wantedCategory) {
    throw new Error(`The category you want to update doesn't exist`);
  }

  return wantedCategory;
};
