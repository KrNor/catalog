import { z } from "zod";

// const mongoRegex = /^[a-f\d]{24}$/i; .regex(mongoRegex, "Invalid category id") (in case I try validating using regex again)

export const createCategorySchema = z.object({
  name: z.string().min(3).max(125),
  description: z.string().min(3).max(255),
  parent: z.string().optional(),
});

export const tagInsideProductSchema = z.object({
  tagName: z.string().min(3).max(125),
  tagAttribute: z.string().min(3).max(125),
});

export const tagSchema = z.object({
  tagName: z.string().min(3).max(125),
  tagAttributes: z.array(z.string().min(3).max(125)),
});

export const tagWithIdSchema = z.object({
  ...tagSchema.shape,
  id: z.string(),
});

export const tagInsideProductWithIdSchema = z.object({
  ...tagInsideProductSchema.shape,
  id: z.string(),
});

export const productSchema = z.object({
  name: z.string().min(3).max(125),
  price: z.coerce
    .number({
      required_error: "price is required",
      invalid_type_error: "price must be a number",
    })
    .nonnegative()
    .int()
    .min(1, "product must cost at least 1 cent"),
  availability: z.coerce.number().gte(-4),
  identifier: z.string().min(3).max(30),
  descriptionShort: z.string().min(3).max(255),
  descriptionLong: z.string().min(3).max(2000),
  category: z.string().min(10, "select a category"),
  tags: z.array(tagInsideProductSchema),
});

export const tagInSearchSchema = z.object({
  tags: z.record(z.string(), z.array(z.string())),
});

export const searchSchema = z.object({
  tags: z.record(z.string(), z.array(z.string())).optional(),
  minPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  maxPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  search: z.string().optional(),
  availability: z.union([z.coerce.number().gte(-4), z.literal("")]).optional(),
  category: z.string().optional(),
  sortType: z.string().optional(),
  resultsPerPage: z.coerce.number().min(1).max(200).default(60).optional(),
  currentPage: z.coerce.number().min(1).default(1).optional(),
});

export type TagInSearchSchemaType = z.infer<typeof tagInSearchSchema>;
export type SearchSchemaType = z.infer<typeof searchSchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;
export type CategorySchemaType = z.infer<typeof createCategorySchema>;
export type TagSchemaType = z.infer<typeof tagSchema>;
export type TagWithIdSchemaType = z.infer<typeof tagWithIdSchema>;

export type TagInsideProductSchemaType = z.infer<typeof tagInsideProductSchema>;
export type TagInsideProductWithIdSchemaType = z.infer<
  typeof tagInsideProductWithIdSchema
>;
