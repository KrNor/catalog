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
