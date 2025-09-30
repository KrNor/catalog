import { axiosInstance } from "@/services/client/axiosClient";

export const apiService = {
  get: async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  },
  post: async (url: string, body: unknown) => {
    const response = await axiosInstance.post(url, body);
    return response.data;
  },
};

export default apiService;
