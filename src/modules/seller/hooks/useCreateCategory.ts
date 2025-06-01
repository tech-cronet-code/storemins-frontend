import { useCreateCategoryMutation } from "../../auth/services/productApi";

// This hook will wrap RTK Query mutation
export const useCreateCategory = () => {
  const [createCategory] = useCreateCategoryMutation();
  return createCategory;
};
