// src/modules/seller/hooks/useManageCategory.ts

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../auth/services/productApi";

export const useManageCategory = () => {
  const [createCategoryMutation] = useCreateCategoryMutation();
  const [updateCategoryMutation] = useUpdateCategoryMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createCategory = async (payload: any) => {
    const response = await createCategoryMutation(payload).unwrap();
    return response;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCategory = async (payload: any) => {
    const response = await updateCategoryMutation(payload).unwrap();
    return response;
  };

  return {
    createCategory,
    updateCategory,
  };
};
