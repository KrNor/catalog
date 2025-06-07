import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const productsSlice = createSlice({
  name: "searchQuery",
  initialState: "",
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state = action.payload;
      return state;
    },
    getSearchQuery: (state, action: PayloadAction<string>) => {
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
