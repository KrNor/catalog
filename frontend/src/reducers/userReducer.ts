import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import UserService from "../services/users";

import type { UserObject } from "../types";
const productsSlice = createSlice({
  name: "user",
  initialState: { username: "", id: "", role: "" } as UserObject,
  reducers: {
    setUser: (state, action: PayloadAction<UserObject>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
      return state;
    },
    emptyUser: (state) => {
      state = { username: "", id: "", role: "" };
      return state;
    },
  },
});
export const { setUser, emptyUser } = productsSlice.actions;

export const loginUserThunk = (username: string, password: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  return async (dispatch: any, _getState: any) => {
    const responseToLogin = await UserService.loginUser(username, password);
    // responseToLogin.m
    console.log(responseToLogin);
    if (responseToLogin === null) {
      await dispatch(emptyUser());
    } else {
      //   console.log(getState().user);
      await dispatch(setUser({ ...responseToLogin }));
      //   console.log(getState().user);
    }
  };
};

export const logoutUserThunk = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  return async (dispatch: any, _getState: any) => {
    await UserService.logoutUser()
      .then(() => console.log("logout succsesfull!"))
      .catch(() => console.log("logout was not succesfull for some reason"));
    await dispatch(emptyUser());
    // if (responseToLogout === null) {
    //   console.log("responseToLogout is null");
    //   await dispatch(emptyUser);
    // } else {
    //   console.log("responseToLogout is NOT null");
    // }
  };
};

// export const getUserObject = () => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return async (dispatch: any) => {
//     const gottenQuerry = dispatch(getSearchQuery);
//     return gottenQuerry as string;
//   };
// };

// export const setCurrentUser = (quer: string) => {
//   console.log(quer);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return async (dispatch: any) => {
//     // const product = await productService.getProduct(id);
//     await dispatch(setSearchQuery(quer));
//   };
// };

export default productsSlice.reducer;
