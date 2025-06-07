import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import productService from "../services/products";
import type { SimplifiedProduct, QueryObject } from "../types"; // autofixed to add type

const productsSlice = createSlice({
  name: "products",
  initialState: [] as SimplifiedProduct[],
  reducers: {
    setProducts: (state, action: PayloadAction<SimplifiedProduct[]>) => {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});
export const { setProducts } = productsSlice.actions;

export const initializeProducts = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: any) => {
    const products = await productService.getAll();
    dispatch(setProducts(products));
  };
};

export const setFilteredProducts = (queryToUse: QueryObject) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: any) => {
    const products = await productService.getFiltered(queryToUse);
    dispatch(setProducts(products));
  };
};

export default productsSlice.reducer;
