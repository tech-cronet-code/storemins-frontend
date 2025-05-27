import { z } from "zod";

// Schemas/productSchema.ts
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
  stockStatus: z.string().optional(),
  shippingClass: z.string().optional(),
  taxClass: z.string().optional(),
  variant: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.any().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
