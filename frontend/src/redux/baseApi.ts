import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    credentials: "include",
  }),
  tagTypes: ["Product", "User", "Category", "Tag", "ImageInfo"],
  endpoints: () => ({}),
});

export default baseApi.reducer;
