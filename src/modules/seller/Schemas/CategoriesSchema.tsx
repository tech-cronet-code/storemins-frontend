import { z } from "zod";

// Schemas/CategoriesSchema.ts
export const CategoriesSchema = z
  .object({
    name: z.string().min(1, "Category name is required"),
    isSubcategory: z.boolean().optional(),
    category: z.string().optional(), // Parent category ID or name
    image: z.any().optional(),
    bannerDesktop: z.any().optional(),
    bannerMobile: z.any().optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoImage: z.any().optional(),
  })
  .refine((data) => {
    if (data.isSubcategory && !data.category) {
      return false;
    }
    return true;
  }, {
    message: "Parent category is required for subcategories.",
    path: ["category"],
  });


export type CategoriesFormValues = z.infer<typeof CategoriesSchema>;
