import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import productService from "../services/products";
import type { Product } from "../types"; // autofixed to add type

type State = {
  product?: Product;
};
const productsSlice = createSlice({
  name: "currentProduct",
  initialState: {} as State,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.product = { ...action.payload };
    },
  },
});
export const { setCurrentProduct } = productsSlice.actions;

export const getProduct = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: any) => {
    const product = await productService.getProduct(id);
    // dispatch(setProducts(products));
    dispatch(setCurrentProduct(product));
  };
};

export default productsSlice.reducer;
