import { z } from "zod";

// Schemas/productSchema.ts

const maxFileSize = 5 * 1024 * 1024; // 5MB

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .nonempty("Price is required")
    .refine((val) => /^\d+$/.test(val), {
      message: "Price must be digits only",
    }),
  discountPrice: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Discount must be digits only",
    }),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock must be 0 or more").optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock"]).optional(),
  shippingClass: z.string().optional(),
  taxClass: z.string().optional(),
  variant: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  // ✅ File validations
  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        return (
          files instanceof FileList &&
          Array.from(files).every(
            (file) => file instanceof File && file.size <= maxFileSize
          )
        );
      },
      {
        message: "Each image must be a valid file under 5MB",
      }
    ),

  video: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || (file instanceof FileList && file.length === 0)) {
          return true; // ✅ no video uploaded, allow
        }
        return (
          file instanceof FileList &&
          file.length <= 1 &&
          file[0] instanceof File &&
          file[0]?.size <= maxFileSize
        );
      },
      {
        message: "Video must be a valid file under 5MB",
      }
    ),

  seoImage: z.any().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
