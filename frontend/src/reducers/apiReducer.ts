import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  Product,
  UserObject,
  LoginDetails,
  CategoryFamilyObject,
  FullCategoryObject,
  TagToSave,
  CategoryToSave,
  SimplifiedProductsWithPaginationMeta,
  TagWithCountFromDb,
  ImageUploadInfo,
} from "../types";

import type { TagWithIdSchemaType, ProductSchemaType } from "../validation";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    credentials: "include",
  }),
  tagTypes: ["Product", "User", "Category", "Tag", "ImageInfo"],
  endpoints: (build) => ({
    getFilteredTags: build.query<TagWithCountFromDb[], string>({
      query: (queryString) => ({ url: `filter/sidebar/?${queryString}` }),
      providesTags: [{ type: "Tag", id: "LIST" }],
    }),
    getProducts: build.query<SimplifiedProductsWithPaginationMeta, string>({
      query: (queryString) => ({ url: `product?${queryString}` }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
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
    getCategoryFamily: build.query<CategoryFamilyObject, string | undefined>({
      query: (categoryId) =>
        categoryId
          ? {
              url: `category/base/${categoryId}`,
            }
          : {
              url: `category/base`,
            },
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
    createCategory: build.mutation<FullCategoryObject, CategoryToSave>({
      query: (body) => ({
        url: `category`,
        body: body,
        method: "POST",
      }),
      invalidatesTags: ["Category"],
    }),
    createProduct: build.mutation<Product, ProductSchemaType>({
      query: (body) => ({
        url: `product`,
        body: body,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    getAllTags: build.query<TagWithIdSchemaType[], void>({
      query: () => ({
        url: `tag`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Tag" as const,
                id,
              })),
              { type: "Tag", id: "LIST" },
            ]
          : [{ type: "Tag", id: "LIST" }],
    }),
    createTag: build.mutation<TagWithIdSchemaType, TagToSave>({
      query: (body) => ({
        url: `tag`,
        body: body,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }, "Tag"],
    }),
    editProduct: build.mutation<Product, Partial<Product>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `product/${id}`,
          body: body,
          method: "POST",
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        "Product",
      ],
    }),
    deleteProduct: build.mutation<Product, string>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        "Product",
      ],
    }),
    getImageInfo: build.query<ImageUploadInfo, void>({
      query: () => `image/info`,
      providesTags: () => [{ type: "ImageInfo" }],
    }),
  }),
});
export const {
  useGetProductsQuery,
  useGetFullProductQuery,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCategoryFamilyQuery,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useCreateCategoryMutation,
  useCreateProductMutation,
  useGetAllTagsQuery,
  useCreateTagMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useGetFilteredTagsQuery,
  useGetImageInfoQuery,
} = api;
export default api.reducer;
