import { z } from "zod";

// const mongoRegex = /^[a-f\d]{24}$/i; .regex(mongoRegex, "Invalid category id") (in case I try validating using regex again)

export const searchSchema = z.object({
  minPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  maxPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  search: z.string().optional(),
  availability: z.union([z.coerce.number().gte(-4), z.literal("")]).optional(),
  category: z.string().optional(),
  sortType: z.string().optional(),
  resultsPerPage: z.coerce.number().max(180).default(60).optional(),
  currentPage: z.coerce.number().min(1).default(1).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(3).max(125),
  description: z.string().min(3).max(255),
  parent: z.string().optional(),
});

export const tagInsideProductSchema = z.object({
  tagName: z.string().max(125),
  tagAttribute: z.string().max(125),
});

export const productSchema = z.object({
  name: z.string().min(3).max(125),
  price: z.number().nonnegative().int(),
  availability: z.number().gte(-4),
  identifier: z.string().max(30),
  descriptionShort: z.string().min(3).max(255),
  descriptionLong: z.string().min(3).max(2000),
  category: z.string().optional(),
  tags: z.array(tagInsideProductSchema),
});

export type SearchSchemaType = z.infer<typeof searchSchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;
export type CategorySchemaType = z.infer<typeof createCategorySchema>;
