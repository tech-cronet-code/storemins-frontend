// src/types/category.ts
export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  status: boolean;
  products: number;
  subCategories?: Category[];
}
