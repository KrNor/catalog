import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SearchFilterObject {
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  availability?: string;
  [key: `tag.${string}`]: string;
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

const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState: { tags: {} } as SearchFilterObject,
  reducers: {
    updateSearchFilter: <K extends keyof SearchFilterObject>(
      state: SearchFilterObject,
      action: PayloadAction<{
        field: K;
        value: SearchFilterObject[K];
      }>
    ) => {
      state[action.payload.field] = action.payload.value;
      return state;
    },
  },
});
export const { updateSearchFilter } = searchFilterSlice.actions;

export const updateFilter = (theKey: string, value: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (dispatch: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateSearchFilter({ field: theKey as any, value }));
  };
};

export default searchFilterSlice.reducer;
