import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import productService from "../services/products";
// import type { Product } from "../types"; // autofixed to add type

const productsSlice = createSlice({
  name: "searchQuery",
  initialState: "",
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state = action.payload;
      console.log("inside a reducer a state is : " + state);
      return state;
    },
    getSearchQuery: (state, action: PayloadAction<string>) => {
      console.log("the state is:" + state);
      console.log("the action.payload is:" + action.payload);
      state = action.payload;
      return state;
    },
  },
});
export const { setSearchQuery, getSearchQuery } = productsSlice.actions;

export const getQuery = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: any) => {
    const gottenQuerry = dispatch(getSearchQuery);
    return gottenQuerry as string;
    // const product = await productService.getProduct(id);
    // dispatch(setSearchQuery(quer));
  };
};

export const setQuery = (quer: string) => {
  console.log(quer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: any) => {
    // const product = await productService.getProduct(id);
    await dispatch(setSearchQuery(quer));
  };
};

export default productsSlice.reducer;
