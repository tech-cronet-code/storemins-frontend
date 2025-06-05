import { useLazyListCategoriesQuery } from "../../auth/services/productApi";

// This hook will wrap RTK Query lazy query
export const useListCategories = () => {
  const [listCategories] = useLazyListCategoriesQuery();
  return listCategories;
};
