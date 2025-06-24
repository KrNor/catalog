import searchFilterReducer from "./reducers/searchFilterReducer";
import apiReducer, { api } from "./reducers/apiReducer";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    [api.reducerPath]: apiReducer,
    searchFilter: searchFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
