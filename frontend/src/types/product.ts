import type { TagToSave } from "@/types/tag";

export interface Product extends SimplifiedProduct {
  identifier: string;
  descriptionLong: string;
  tags: TagToSave[];
}

export interface SimplifiedProduct {
  name: string;
  price: number; // saved in cents
  availability: number;
  descriptionShort: string;
  category: string;
  id: string;
}

export interface SimplifiedProductsWithPaginationMeta {
  data: SimplifiedProduct[];
  currentPage: number;
  productCount: number;
  resultsPerPage: number;
}

// export interface TagToSave {
//   tagName: string;
//   tagAttribute: string;
// }
