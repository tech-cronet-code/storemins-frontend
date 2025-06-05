// src/modules/seller/hooks/useUpdateCategory.ts

import { useUpdateCategoryMutation } from "../../auth/services/productApi";

export const useUpdateCategory = () => {
  const [updateCategoryMutation] = useUpdateCategoryMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCategory = async (payload: any) => {
    const response = await updateCategoryMutation(payload).unwrap();
    return response;
  };

  return {
    updateCategory,
  };
};
