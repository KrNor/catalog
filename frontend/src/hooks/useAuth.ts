import Cookies from "js-cookie";
import { useAppDispatch } from "@/hooks/index";

import type { LoginDetails } from "@/types/auth";
import {
  api,
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} from "@/redux/apiReducer";

export const useAuth = () => {
  const dispatch = useAppDispatch();

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
