import z from "zod";
import mongoose from "mongoose";

export type QueryObject = {
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  avaliability?: string;
  category?: string;
};

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
