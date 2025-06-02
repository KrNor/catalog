import z from "zod";
import mongoose from "mongoose";
export interface Product {
  name: String;
  price: Number; // saved in cents
  avaliability: Number;
  Identifier: String;
  descriptionShort: String;
  descriptionLong: String;
  category: String;
}

export interface Category {
  name: String;
  description: String;
  parent: String;
  lineage: [String];
}

export interface Tag {
  tagName: String;
  tagAttributes: [String];
}

export const zodTag = z.object({
  tagName: z.string(),
  tagAttributes: z.array(z.string().optional()),
});

export const zodTagToSave = z.object({
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
  Identifier: z.string(),
  descriptionShort: z.string().min(3),
  descriptionLong: z.string().min(3),
  category: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .optional(),
});

export type zodTagToSaveType = z.infer<typeof zodTagToSave>;
export type zodTagType = z.infer<typeof zodTag>;
export type zodProductType = z.infer<typeof zodProduct>;
export type zodCategoryType = z.infer<typeof zodCategory>;
