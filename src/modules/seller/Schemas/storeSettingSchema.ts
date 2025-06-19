import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024; // 5MB

export const storeSettingSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  categoryLinks: z
    .array(
      z.object({
        parentCategoryId: z.string().optional(),
        parentCategoryName: z.string().optional(), // ✅ added
        subCategoryId: z.string().optional(),
        subCategoryName: z.string().optional(), // ✅ added
      })
    )
    .min(1, "At least one category must be selected"),

  categoryName: z.string().optional(),

  price: z
    .string()
    .nonempty("Price is required")
    .refine((val) => /^\d+$/.test(val), {
      message: "Price must be digits only",
    }),

  discountedPrice: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Discount must be digits only",
    }),

  description: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock must be 0 or more").optional(),
  sku: z.string().optional(),

  stockStatus: z.enum(["in_stock", "out_of_stock"]).optional(),
  shippingClass: z.string().optional(),
  taxClass: z.string().optional(),
  variant: z.string().optional(),

  // ✅ NEW SEO fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(), // if you're passing it as imageUrl in backend

  shippingWeight: z.coerce.number().optional(),
  hsnCode: z.string().optional(),
  gstPercent: z.coerce.number().optional(),

  // ✅ NEW Enum Product Type
  type: z.enum(["PHYSICAL", "DIGITAL", "MEETING", "WORKSHOP"]).optional(),

  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (Array.isArray(files) && files.every((f) => typeof f === "string"))
          return true;
        return (
          files instanceof FileList &&
          Array.from(files).every(
            (file) => file instanceof File && file.size <= maxFileSize
          )
        );
      },
      { message: "Each image must be a valid file under 5MB" }
    ),

  video: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || (file instanceof FileList && file.length === 0))
          return true;
        if (typeof file === "string") return true;
        return (
          file instanceof FileList &&
          file.length === 1 &&
          file[0] instanceof File &&
          file[0].size <= maxFileSize
        );
      },
      { message: "Video must be a valid file under 5MB" }
    ),

  seoImage: z.any().optional(),
});

export type storeSettingFormValues = z.infer<typeof storeSettingSchema>;
