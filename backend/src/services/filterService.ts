import { FilterQuery, Types, PipelineStage } from "mongoose";

import Product from "../models/product";
import { ProductDocument } from "../models/product";

interface TagAttributeToReturn {
  tagAttribute: string;
  count: number;
}

interface TagWithCountToReturn {
  count: number;
  tagName: string;
  attributes: TagAttributeToReturn[];
}

export const getFilteredTagsWithCount = async (
  filterObj: FilterQuery<ProductDocument>
) => {
  if (typeof filterObj.category === "string") {
    filterObj.category = new Types.ObjectId(filterObj.category);
  }

  // console.log(filterObj);

  const pipeline: PipelineStage[] = [
    {
      $match: filterObj,
    },
    { $unwind: "$tags" },
    {
      $group: {
        _id: {
          tagName: "$tags.tagName",
          tagAttribute: "$tags.tagAttribute",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.tagName",
        count: { $sum: "$count" },
        attributes: {
          $push: {
            tagAttribute: "$_id.tagAttribute",
            count: "$count",
          },
        },
      },
    },
    {
      $set: {
        attributes: {
          $sortArray: {
            input: "$attributes",
            sortBy: { count: -1 },
          },
        },
      },
    },
    { $sort: { count: -1 } },
    {
      $set: {
        tagName: "$_id",
      },
    },
    { $unset: ["_id"] },
  ];

  const result: TagWithCountToReturn[] = await Product.aggregate(pipeline);
  return result;
};
