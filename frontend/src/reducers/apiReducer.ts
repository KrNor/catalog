import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  Product,
  SimplifiedProduct,
  UserObject,
  LoginDetails,
  CategoryFamilyObject,
  FullCategoryObject,
} from "../types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    credentials: "include",
  }),
  tagTypes: ["Product", "User", "Category"],
  endpoints: (build) => ({
    getProducts: build.query<SimplifiedProduct[], string>({
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
    getBaseCategoryFamily: build.query<CategoryFamilyObject, void>({
      query: () => ({
        url: `category/base`,
      }),
      providesTags: () => [{ type: "Category", id: "BASE" }],
    }),
    getCategoryFamily: build.query<CategoryFamilyObject, string>({
      query: (categoryId) => ({
        url: `category/base/:${categoryId}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    getAllCategories: build.query<FullCategoryObject[], void>({
      query: () => ({
        url: `category`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    getCategoryById: build.query<FullCategoryObject, string>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    deleteCategory: build.mutation<FullCategoryObject, string>({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),
    editCategory: build.mutation<
      FullCategoryObject,
      Partial<FullCategoryObject>
    >({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `category/${id}`,
          body: body,
          method: "POST",
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),
  }),
});
//   invalidatesTags: [{ type: "User", id: "CURRENT" }],
export const {
  useGetProductsQuery,
  useGetFullProductQuery,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetBaseCategoryFamilyQuery,
  useGetCategoryFamilyQuery,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} = api;
export default api.reducer;
