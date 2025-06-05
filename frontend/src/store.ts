import productReducer from "./reducers/productReducer";
import currentProductReducer from "./reducers/currentProductReducer";
import searchQueryReducer from "./reducers/searchQueryReducer";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    products: productReducer,
    currentProduct: currentProductReducer,
    searchQuery: searchQueryReducer,
  },
});

export default store;
