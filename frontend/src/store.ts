import productReducer from "./reducers/productReducer";
import currentProductReducer from "./reducers/currentProductReducer";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    products: productReducer,
    currentProduct: currentProductReducer,
  },
});

export default store;
