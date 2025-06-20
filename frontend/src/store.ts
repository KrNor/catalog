import productReducer from "./reducers/productReducer";
import currentProductReducer from "./reducers/currentProductReducer";
import searchQueryReducer from "./reducers/searchQueryReducer";
import userReducer from "./reducers/userReducer";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    products: productReducer,
    currentProduct: currentProductReducer,
    searchQuery: searchQueryReducer,
    user: userReducer,
  },
});

export default store;
