import { z } from "zod";

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

export type SearchSchemaType = z.infer<typeof searchSchema>;
