// Schemas/productSchema.ts
import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024; // 5MB

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  // Backend accepts empty or omitted; don't force min(1) here
  categoryLinks: z
    .array(
      z.object({
        parentCategoryId: z.string().uuid().optional(),
        parentCategoryName: z.string().optional(),
        subCategoryId: z.string().uuid().optional(),
        subCategoryName: z.string().optional(),
      })
    )
    .optional(),

  categoryName: z.string().optional(),

  // Allow decimals; coerce to number
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  discountedPrice: z
    .coerce
    .number()
    .optional()
    .refine((v) => v === undefined || v >= 0, {
      message: "Discount must be 0 or more",
    }),

  description: z.string().optional(),

  stock: z.coerce.number().min(0, "Stock must be 0 or more").optional(),
  sku: z.string().optional(),

  stockStatus: z.enum(["in_stock", "out_of_stock"]).optional(),
  shippingClass: z.string().optional(),
  taxClass: z.string().optional(),

  // ✅ Correct: array of { optionName, optionValues[] }
  variant: z
    .array(
      z.object({
        optionName: z.string().min(1, "Option name is required"),
        optionValues: z.array(z.string().min(1)).min(1, "Add at least one value"),
      })
    )
    .optional(),

  // Gallery files (or undefined). We accept FileList OR array of URLs (strings) for edit mode.
  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        if (Array.isArray(files) && files.every((f) => typeof f === "string")) return true;
        return (
          files instanceof FileList &&
          Array.from(files).every((file) => file instanceof File && file.size <= maxFileSize)
        );
      },
      { message: "Each image must be a valid file under 5MB" }
    ),

  // Ordered existing URLs used by your gallery editor
  mediaUrls: z.array(z.string().min(1)).optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(), // allow empty string too
  seoImage: z.any().optional(),       // FileList (handled in UI)

  // Shipping/Tax
  shippingWeight: z.coerce.number().optional(),
  hsnCode: z.string().optional(),
  gstPercent: z.coerce.number().optional(),

  // Product type
  type: z.enum(["PHYSICAL", "DIGITAL", "MEETING", "WORKSHOP"]).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
