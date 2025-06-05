import axios from "axios";

const baseUrl = "http://localhost:3000/api/product";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// const response = await axios.get("/api/products/search", {
//   params: {
//     q: searchQuery,
//     limit: 20,
//     offset: 0,
//   },
// });
// setResults(response.data.products);
const getFiltered = async (searchQuery: string) => {
  const response = await axios.get(baseUrl, {
    params: {
      search: searchQuery,
    },
  });
  return response.data;
};

const getProduct = async (id: string) => {
  const response = await axios.get(baseUrl + `/${id}`);
  return response.data;
};

export default { getAll, getProduct, getFiltered };
