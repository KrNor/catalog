import Category from "../models/category";

import Product from "../models/product";

export const refreshProductCount = async () => {
  const pipeline = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    { $unwind: "$categoryData" },
    {
      $project: {
        categoryIds: {
          $concatArrays: [["$category"], "$categoryData.lineage"],
        },
      },
    },
    { $unwind: "$categoryIds" },

    {
      $group: {
        _id: "$categoryIds",
        productCount: { $sum: 1 },
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  await Category.updateMany({}, { productCount: 0 });

  if (result.length > 0) {
    const bulkOps = result.map((category) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { productCount: category.productCount },
        upsert: false,
      },
    }));
    await Category.bulkWrite(bulkOps);
  }
  return result;
};
