import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  SimplifiedProduct,
  UserObject,
  LoginDetails,
} from "../types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    credentials: "include",
  }),
  tagTypes: ["Product", "User"],
  endpoints: (build) => ({
    getAllProducts: build.query<SimplifiedProduct[], string>({
      query: (queryString) => ({ url: `product?${queryString}` }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getFullProduct: build.query<Product, string>({
      query: (id) => ({ url: `product/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCurrentUser: build.query<UserObject, void>({
      query: () => ({
        url: `auth/check`,
      }),
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),
    loginUser: build.mutation<UserObject, LoginDetails>({
      query: (loginDetails) => ({
        url: `auth/login`,
        body: loginDetails,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
    logoutUser: build.mutation<UserObject, void>({
      query: (loginDetails) => ({
        url: `auth/logout`,
        body: loginDetails,
        method: "POST",
      }),
    }),
  }),
});
//   invalidatesTags: [{ type: "User", id: "CURRENT" }],
export const {
  useGetAllProductsQuery,
  useGetFullProductQuery,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} = api;
export default api.reducer;
