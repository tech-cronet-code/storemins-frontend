// src/types/category.ts
export interface Category {
  id: string;
  name: string;
  image: string;
  status: boolean;
  products: number;
  subCategories?: Category[];
}
