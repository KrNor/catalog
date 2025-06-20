import axios from "axios";
import type { UserObject } from "../types";

const baseUrl = "http://localhost:3000/api/auth";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const loginUser = async (
  username: string,
  password: string
): Promise<UserObject | null> => {
  console.log("sending server the user logins");
  try {
    const response = await axiosInstance
      .post("/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        return { ...response.data };
      });
    console.log("this is the respondse: " + response);
    if (!response.user) {
      return null;
    } else {
      return response.user;
    }
  } catch {
    throw new Error("unknown user");
  }
};

const logoutUser = async () => {
  const response = await axiosInstance.post("/logout");

  console.log("this is the respondse: " + response);
  return response;
  //   console.log(response.user);
};

const checkUserRole = async () => {
  try {
    const response = await axiosInstance("/check");
    if (response.data && response.data.role) {
      return response.data.role;
    }

    return "";
  } catch {
    throw new Error("unknown user");
  }
};

export default { loginUser, logoutUser, checkUserRole };
