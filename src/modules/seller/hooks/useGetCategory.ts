import { useLazyGetCategoryQuery } from "../../auth/services/productApi";

export const useGetCategory = () => {
  const [trigger, hookResult] = useLazyGetCategoryQuery();

  const getCategory = async (id: string, type: "PARENT" | "SUB") => {
    return await trigger({ id, type }).unwrap(); // Pass both id + type
  };

  return {
    getCategory,
    ...hookResult,
  };
};
