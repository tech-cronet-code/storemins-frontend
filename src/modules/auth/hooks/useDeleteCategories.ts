// src/views/seller/hooks/useDeleteCategories.ts

import { showToast } from "../../../common/utils/showToast";
import { useDeleteCategoriesMutation } from "../services/productApi";

export const useDeleteCategories = () => {
  const [deleteCategoriesApi, { isLoading }] = useDeleteCategoriesMutation();

  const deleteCategories = async (ids: string[]) => {
    try {
      const res = await deleteCategoriesApi({ ids }).unwrap();
      showToast({
        type: "success",
        message: res.message || "Categories deleted successfully",
        showClose: true,
      });
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete Categories Error", error);
      showToast({
        type: "error",
        message: error?.data?.message || "Failed to delete categories",
        showClose: true,
      });
      return false;
    }
  };

  return { deleteCategories, isLoading };
};
