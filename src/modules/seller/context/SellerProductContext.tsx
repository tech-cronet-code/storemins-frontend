import { createContext, ReactNode } from "react";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useListCategories } from "../hooks/useListCategories";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useGetCategory } from "../hooks/useGetCategory";
import { useDeleteCategories } from "../../auth/hooks/useDeleteCategories";

interface SellerProductContextType {
  createCategory: ReturnType<typeof useCreateCategory>;
  listCategories: ReturnType<typeof useListCategories>;
  updateCategory: ReturnType<typeof useUpdateCategory>;
  getCategory: ReturnType<typeof useGetCategory>;
  deleteCategories: ReturnType<typeof useDeleteCategories>;
}

// 1. createContext
export const SellerProductContext =
  createContext<SellerProductContextType | null>(null);

// 2. Provider component
export const SellerProductProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const createCategory = useCreateCategory();
  const listCategories = useListCategories();
  const updateCategory = useUpdateCategory();
  const getCategory = useGetCategory();
  const deleteCategories = useDeleteCategories();

  const contextValue = {
    createCategory,
    listCategories,
    updateCategory,
    getCategory,
    deleteCategories,
  };

  return (
    <SellerProductContext.Provider value={contextValue}>
      {children}
    </SellerProductContext.Provider>
  );
};
