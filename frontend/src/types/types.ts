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

export interface TagToSave {
  tagName: string;
  tagAttribute: string;
}

export interface UserObject {
  user: {
    username: string;
    id: string;
    role: "admin" | "user" | "";
  };
}
export interface LoginDetails {
  username: string;
  password: string;
}

export interface CategoryToReturn {
  id: string;
  name: string;
  productCount: number;
}
export interface CategoryFamilyObject {
  lineage: CategoryToReturn[];
  category: CategoryToReturn[];
  imediateChildren: CategoryToReturn[];
}

export interface FullCategoryObject {
  name: string;
  description: string;
  parent: string | null;
  lineage: string[];
  id: string;
}

export interface CategoryToSave {
  name: string;
  description: string;
  parent?: string;
}

export interface SimplifiedProductsWithPaginationMeta {
  data: SimplifiedProduct[];
  currentPage: number;
  productCount: number;
  resultsPerPage: number;
}

export interface TagAttributeFromDb {
  tagAttribute: string;
  count: number;
}

export interface TagWithCountFromDb {
  count: number;
  tagName: string;
  attributes: TagAttributeFromDb[];
}

export interface ImageUploadSignatureObject {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface ImageUploadInfo {
  apiKey: string;
  cloudName: string;
}
