import axios from "axios";

export const axiosGet = async (params: string) => {
  try {
    const ress = await axios
      .get(`http://localhost:3000/api/image/signature?${params}`, {
        withCredentials: true,
      })
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
