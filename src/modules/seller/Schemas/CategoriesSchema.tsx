import { z } from "zod";

export const CategoriesSchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .max(50, "Category name must not exceed 50 characters"),
  isSubcategory: z.boolean().optional(),
  category: z.string().optional(),
  // image: z.any().optional(),
  // ✅ Make image fully optional and validation-safe
  // image: z
  //   .union([z.array(z.instanceof(File)).max(1), z.undefined(), z.null()])
  //   .optional(),

  image: z
    .instanceof(FileList)
    .optional()
    .or(z.array(z.instanceof(File)).optional()),

  bannerDesktop: z.any().optional(),
  bannerMobile: z.any().optional(),
  description: z.string().optional(),

  // SEO Fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(), // ✅ add this
  seoImage: z.any().optional(),
});

// ✅ Export the inferred type separately
export type CategoriesFormValues = z.infer<typeof CategoriesSchema>;
