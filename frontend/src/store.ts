import { configureStore } from "@reduxjs/toolkit";
import apiReducer, { api } from "./reducers/apiReducer";

const store = configureStore({
  reducer: {
    [api.reducerPath]: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
