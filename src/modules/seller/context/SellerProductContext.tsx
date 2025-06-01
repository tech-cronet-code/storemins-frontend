import { createContext, ReactNode } from "react";
import { useCreateCategory } from "../hooks/useCreateCategory"; 
import { useListCategories } from "../hooks/useListCategories"; 
import { useManageCategory } from "../hooks/useManageCategory"; 

interface SellerProductContextType {
  createCategory: ReturnType<typeof useCreateCategory>;
  listCategories: ReturnType<typeof useListCategories>;
  manageCategory: ReturnType<typeof useManageCategory>; 
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
  const manageCategory = useManageCategory(); // <---

  const contextValue = {
    createCategory,
    listCategories,
    manageCategory, 
  };

  return (
    <SellerProductContext.Provider value={contextValue}>
      {children}
    </SellerProductContext.Provider>
  );
};
