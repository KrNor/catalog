import store from "./store";

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export interface Product extends SimplifiedProduct {
  Identifier: string;
  descriptionLong: string;
  tags: [TagToSave];
}
export interface SimplifiedProduct {
  name: string;
  price: number; // saved in cents
  avaliability: number;
  descriptionShort: string;
  category: string;
  id: string;
}

export interface TagToSave {
  tagName: string;
  tagAttribute: string;
}
