import z from "zod";
import mongoose from "mongoose";
import { FilterQuery } from "mongoose";
import { ProductDocument } from "./models/product";
import { Request } from "express";

export const zodProductFilter = z.object({
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  availability: z.coerce.number().optional(),
  category: z.string().optional(),
});

export type ProductFilter = z.infer<typeof zodProductFilter>;

export const zodFilterInitial = z.object({
  tagName: z.string(),
  tagAttributes: z.array(z.string().optional()),
});

export const zodTag = z.object({
  tagName: z.string(),
  tagAttributes: z.array(z.string().optional()),
});

export const zodTagInsideProduct = z.object({
  tagName: z.string(),
  tagAttribute: z.string(),
});

export const zodCategory = z.object({
  name: z.string(),
  description: z.string(),
  parent: z.string().optional(),
  lineage: z.array(z.string()).optional(),
});

export const zodProduct = z.object({
  name: z.string().min(3),
  price: z.number().nonnegative(),
  avaliability: z.number().gte(-4),
  identifier: z.string(),
  descriptionShort: z.string().min(3),
  descriptionLong: z.string().min(3),
  category: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .optional(),
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
  avaliability: number;
  descriptionShort: string;
  category: string;
  id: string;
}

export const zodUserLogin = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export type UserLoginRequest = z.infer<typeof zodUserLogin>;

export interface RequestWithFilter extends Request {
  productFilter?: FilterQuery<ProductDocument>;
}
