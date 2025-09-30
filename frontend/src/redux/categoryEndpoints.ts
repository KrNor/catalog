import { baseApi } from "@/redux/baseApi";
import type {
  CategoryFamilyObject,
  FullCategoryObject,
  CategoryToSave,
} from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
});

export const {
  useGetCategoryFamilyQuery,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useCreateCategoryMutation,
} = categoryApi;
