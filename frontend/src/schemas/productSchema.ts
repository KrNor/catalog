import { z } from "zod";

import { tagInsideProductSchema } from "./tagSchema";

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

export type ProductSchemaType = z.infer<typeof productSchema>;
