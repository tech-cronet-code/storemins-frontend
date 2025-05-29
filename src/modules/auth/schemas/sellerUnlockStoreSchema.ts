import { z } from "zod";

export const sellerUnlockStoreFormSchema = z.object({
  businessName: z
    .string()
    .nonempty("Business URL is required")
    .min(3, "Business URL must be at least 3 characters")
    .max(30, "Cannot exceed 30 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Only lowercase letters, numbers & hyphens (no leading/trailing or repeated hyphens)",
    }),
});

export type SellerUnlockStoreFormValues = z.infer<
  typeof sellerUnlockStoreFormSchema
>;
