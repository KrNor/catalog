import store from "./store";

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export interface QueryObject {
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  availability?: string;
  category?: string;
}

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

export interface SearchFilterObject {
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  availability?: string;
  tags: { [key: string]: unknown };
  category?: string;
  sortType?:
    | "priceLow"
    | "priceHigh"
    | "nameAz"
    | "nameZa"
    | "oldest"
    | "newest";
  resultsPerPage?: number;
  currentPage?: number;
}

export interface CategoryToReturn {
  id: string;
  name: string;
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
