import { z } from "zod";

export const searchSchema = z.object({
  minPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  maxPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  search: z.string().optional(),
  availability: z.union([z.coerce.number().gte(-4), z.literal("")]).optional(),
  category: z.string().optional(),
  sortType: z
    .enum(["", "newest", "oldest", "priceAsc", "priceDesc", "nameAZ", "nameZA"])
    .optional(),
  resultsPerPage: z.coerce.number().max(180).default(60).optional(),
  currentPage: z.coerce.number().min(1).default(1).optional(),
});
export type SearchSchema = z.infer<typeof searchSchema>;
