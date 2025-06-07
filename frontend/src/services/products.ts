import axios from "axios";
import type { QueryObject } from "../types";

const baseUrl = "http://localhost:3000/api/product";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getFiltered = async (searchQuery: QueryObject) => {
  console.log(searchQuery);
  console.log({ ...searchQuery });
  const response = await axios.get(baseUrl, {
    params: { ...searchQuery },
  });
  return response.data;
};

const getProduct = async (id: string) => {
  const response = await axios.get(baseUrl + `/${id}`);
  return response.data;
};

export default { getAll, getProduct, getFiltered };
