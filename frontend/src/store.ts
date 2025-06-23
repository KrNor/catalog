import searchQueryReducer from "./reducers/searchQueryReducer";
import apiReducer, { api } from "./reducers/apiReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [api.reducerPath]: apiReducer,
    searchQuery: searchQueryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
