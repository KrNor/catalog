import { useGetCategoryFamilyQuery } from "../reducers/apiReducer";

export const useBaseCategoryFamily = () => {
  const {
    data: baseCatFam,
    isLoading: baseCatFamLoading,
    error: baseCatFamError,
  } = useGetCategoryFamilyQuery(undefined);

  return {
    baseCatFam,
    baseCatFamLoading,
    baseCatFamError,
  };
};
