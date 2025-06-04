import axios from "axios";

const baseUrl = "http://localhost:3000/api/product";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getProduct = async (id: string) => {
  const response = await axios.get(baseUrl + `/${id}`);
  return response.data;
};

export default { getAll, getProduct };
