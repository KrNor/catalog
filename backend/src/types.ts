import z from "zod";
import { FilterQuery, Types } from "mongoose";
import { ProductDocument } from "./models/product";
import { Request } from "express";

const validMongoId = (val: string) => {
  return Types.ObjectId.isValid(val);
};

export const zodBaseFilter = z.object({
  minPrice: z.coerce.number().nonnegative().int().optional(),
  maxPrice: z.coerce.number().nonnegative().int().optional(),
  search: z.string().trim().optional(),
  availability: z.coerce.number().gte(-4).optional(),
  category: z
    .string()
    .refine((val) => {
      return validMongoId(val);
    })
    .optional(),
});

export const zodProductFilter = z.object({
  ...zodBaseFilter.shape,
  sortType: z
    .enum(["", "newest", "oldest", "priceAsc", "priceDesc", "nameAZ", "nameZA"])
    .optional(),
  resultsPerPage: z.coerce.number().max(200).default(60).optional(),
  currentPage: z.coerce.number().min(1).default(1).optional(),
  tags: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

export const zodSidebarFilter = z.object({
  ...zodBaseFilter.shape,
});

export type ProductFilter = z.infer<typeof zodProductFilter>;
export type SidebarFilter = z.infer<typeof zodSidebarFilter>;

export const zodFilterInitial = z.object({
  tagName: z.string().max(125),
  tagAttributes: z.array(z.string().max(125).optional()),
});

export const zodTag = z.object({
  tagName: z.string().max(125),
  tagAttributes: z.array(z.string().max(125).optional()),
});

export const zodTagInsideProduct = z.object({
  tagName: z.string().max(125),
  tagAttribute: z.string().max(125),
});

export const zodCategory = z.object({
  name: z.string().min(3).max(125),
  description: z.string().min(3).max(255),
  parent: z
    .string()
    .refine((val) => {
      return validMongoId(val);
    })
    .optional(),
  lineage: z
    .array(
      z.string().refine((val) => {
        return validMongoId(val);
      })
    )
    .optional(),
});

export const zodProduct = z.object({
  name: z.string().min(3).max(125),
  price: z.number().nonnegative().int(),
  availability: z.number().gte(-4),
  identifier: z.string().max(30),
  descriptionShort: z.string().min(3).max(255),
  descriptionLong: z.string().min(3).max(2000),
  category: z.string().refine(
    (val) => {
      return validMongoId(val);
    },
    { message: "invalid category id" }
  ),
  tags: z.array(zodTagInsideProduct),
});

export type TagInsideProduct = z.infer<typeof zodTagInsideProduct>;
export type TagWithArray = z.infer<typeof zodTag>;
export type ProductType = z.infer<typeof zodProduct>;
export type CategoryType = z.infer<typeof zodCategory>;

export const zodTagWithId = z.object({
  ...zodTag.shape,
  id: z.string(),
});

export const zodTagInsideProductWithId = z.object({
  ...zodTagInsideProduct.shape,
  id: z.string(),
});

export const zodProductWithId = z.object({
  ...zodProduct.shape,
  id: z.string(),
});

export const zodCategoryWithId = z.object({
  ...zodCategory.shape,
  id: z.string(),
});

export type TagWithArrayWithId = z.infer<typeof zodTagWithId>;
export type TagInsideProductWithId = z.infer<typeof zodTagInsideProductWithId>;
export type ProductWithId = z.infer<typeof zodProductWithId>;
export type CategoryWithId = z.infer<typeof zodCategoryWithId>;

export interface SimplifiedProduct {
  name: string;
  price: number; // saved in cents
  availability: number;
  descriptionShort: string;
  category: string;
  id: string;
}

export const zodUserLogin = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export type UserLoginRequest = z.infer<typeof zodUserLogin>;

export interface PageObject {
  currentPage: number;
  resultsPerPage: number;
}

export interface RequestWithFilter extends Request {
  productFilter?: FilterQuery<ProductDocument>;
  sortingType?: string;
  pagingObject?: PageObject;
}

export interface RequestWithSidebarFilter extends Request {
  productFilter?: FilterQuery<ProductDocument>;
}

export const UpdateCategoryZodSchema = z.string();

export const zodCloudinaryOptions = z.object({
  timestamp: z.coerce.number().nonnegative(),
  source: z.string().trim(),
});

export type CloudinaryOptionsType = z.infer<typeof zodCloudinaryOptions>;

export interface RequestWithCloudinaryOptions extends Request {
  cloudinaryOptions?: CloudinaryOptionsType;
}
