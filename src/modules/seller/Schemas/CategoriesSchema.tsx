import { z } from "zod";

const ImageSchema = z
  .union([
    z.instanceof(FileList).transform(fl => (fl && fl.length ? fl : undefined)),
    z.array(z.instanceof(File)).max(1).transform(arr => (arr && arr.length ? arr : undefined)),
    z.literal(""),          // some browsers/RHF edge cases
    z.undefined(),
    z.null(),
  ])
  .optional()
  .transform(v => {
    // normalize "", null, undefined to undefined so it doesn't affect validity
    return v && v !== "" ? v : undefined;
  });

export const CategoriesSchema = z
  .object({
    name: z
      .string()
      .min(3, "Category name must be at least 3 characters long")
      .max(50, "Category name must not exceed 50 characters"),
    isSubcategory: z.boolean().optional(),
    category: z.string().optional(),

    // ✅ now truly optional
    image: ImageSchema,

    bannerDesktop: z.any().optional(),
    bannerMobile: z.any().optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
    seoImage: z.any().optional(),
  })
  .refine(
    (data) => (data.isSubcategory ? !!data.category?.trim() : true),
    { path: ["category"], message: "Please select a parent category" }
  );

export type CategoriesFormValues = z.infer<typeof CategoriesSchema>;
