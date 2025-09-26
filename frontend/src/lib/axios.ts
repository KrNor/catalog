import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

export const axiosGet = async (params: string) => {
  try {
    const ress = await axios
      .get(`image/signature?${params}`)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch(() =>
        console.log("there was a problem getting the signature from database")
      );
    return ress;
  } catch {
    throw new Error("Axios request failed");

    return null;
  }
};
