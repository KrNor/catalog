import Cookies from "js-cookie";
import { useDispatch, useSelector, useStore } from "react-redux";
// import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import type { AppDispatch, AppStore, RootState, LoginDetails } from "./types";
import {
  api,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCategoryFamilyQuery,
  // useGetCategoryByIdQuery,
} from "./reducers/apiReducer";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const CategoryHook = (localCategory: string | undefined) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentCategory, _setCurrentCategory] = useState<string | undefined>(
    localCategory
  );

  const {
    data: lineage,
    isLoading,
    error,
  } = useGetCategoryFamilyQuery(currentCategory); //categoryInParams   currentCategory

  return {
    lineage,
    isLoading,
    error,
  };
};

export const AuthHook = () => {
  const dispatch = useDispatch();
  const hasIsLoggedInCookie = Cookies.get("isLoggedIn") === "true";
  const {
    data: user,
    isLoading,
    error,
  } = useGetCurrentUserQuery(undefined, {
    skip: !hasIsLoggedInCookie,
  });
  const [loginUser] = useLoginUserMutation({
    fixedCacheKey: "shared-user-details",
  });
  const [logoutUser] = useLogoutUserMutation({
    fixedCacheKey: "shared-user-details",
  });

  const login = async (loginDetails: LoginDetails) => {
    return await loginUser(loginDetails).unwrap();
  };

  const logout = async () => {
    dispatch(api.util.resetApiState());
    return await logoutUser().unwrap();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };
};
