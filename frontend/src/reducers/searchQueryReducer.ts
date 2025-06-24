import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const searchFilterSlice = createSlice({
  name: "searchFilter",
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
export const { setSearchQuery, getSearchQuery } = searchFilterSlice.actions;

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
    await dispatch(setSearchQuery(quer));
  };
};

export default searchFilterSlice.reducer;
