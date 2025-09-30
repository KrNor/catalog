import { baseApi } from "@/redux/baseApi";
import type { UserObject, LoginDetails } from "@/types/auth";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const {
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} = userApi;
