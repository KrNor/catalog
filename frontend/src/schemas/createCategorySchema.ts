import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3).max(125),
  description: z.string().min(3).max(255),
  parent: z.string().optional(),
});

export type CategorySchemaType = z.infer<typeof createCategorySchema>;
