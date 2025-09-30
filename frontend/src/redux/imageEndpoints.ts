import { baseApi } from "@/redux/baseApi";
import type { ImageUploadInfo } from "@/types/image";

export const imageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getImageInfo: build.query<ImageUploadInfo, void>({
      query: () => `image/info`,
      providesTags: () => [{ type: "ImageInfo" }],
    }),
  }),
});

export const { useGetImageInfoQuery } = imageApi;
