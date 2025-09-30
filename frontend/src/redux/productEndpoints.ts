import { baseApi } from "@/redux/baseApi";

import type {
  Product,
  SimplifiedProductsWithPaginationMeta,
} from "@/types/product";
import type { ProductSchemaType } from "@/schemas/productSchema";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
    createProduct: build.mutation<Product, ProductSchemaType>({
      query: (body) => ({
        url: `product`,
        body: body,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
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
  }),
});

export const {
  useGetProductsQuery,
  useGetFullProductQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} = productApi;
