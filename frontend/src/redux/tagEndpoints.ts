import { baseApi } from "@/redux/baseApi";
import type { TagWithCountFromDb, TagToSave } from "@/types/tag";

import type { TagWithIdSchemaType } from "@/schemas/tagSchema";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFilteredTags: build.query<TagWithCountFromDb[], string>({
      query: (queryString) => ({ url: `filter/sidebar/?${queryString}` }),
      providesTags: [{ type: "Tag", id: "LIST" }],
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
  }),
});

export const {
  useGetAllTagsQuery,
  useCreateTagMutation,
  useGetFilteredTagsQuery,
} = tagApi;
