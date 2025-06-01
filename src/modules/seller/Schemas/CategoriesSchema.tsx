import { z } from "zod";

export const CategoriesSchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .max(50, "Category name must not exceed 50 characters"),
  isSubcategory: z.boolean().optional(),
  category: z.string().optional(),
  image: z.any().optional(),
  bannerDesktop: z.any().optional(),
  bannerMobile: z.any().optional(),
  description: z.string().optional(),

  // SEO Fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.any().optional(),
});

// ✅ Export the inferred type separately
export type CategoriesFormValues = z.infer<typeof CategoriesSchema>;
