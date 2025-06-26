import axios from "axios";

const baseUrl = "http://localhost:3000/api/category";

export interface CategoryObjectToSave {
  name: string;
  description: string;
  parent?: string;
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const getAll = async () => {
  const response = await axiosInstance.get("");
  return response.data;
};

const getBase = async () => {
  const response = await axiosInstance.get(`/base`);
  return response.data;
};

const getWholeLineage = async (idOfCategory: string) => {
  const response = await axiosInstance.get(`/base/${idOfCategory}`);
  return response.data;
};

const createCategory = async (categoryObject: CategoryObjectToSave) => {
  const response = await axiosInstance.post("", categoryObject);
  return response.data;
};

const deleteCategory = async (categoryId: string) => {
  const response = await axiosInstance.delete(`/:${categoryId}`);
  return response.data;
};

export default {
  getBase,
  getWholeLineage,
  createCategory,
  deleteCategory,
  getAll,
};
