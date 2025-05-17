// src/schemas/sellerUnlockStoreSchema.ts
import { z } from "zod";

export const sellerUnlockStoreFormSchema = z.object({
  businessName: z
    .string()
    .nonempty("Business url is required")
    .min(3, "Business url must be at least 3 characters")
    .max(30, "Cannot exceed 30 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers & hyphens"),
});

export type SellerUnlockStoreFormValues = z.infer<
  typeof sellerUnlockStoreFormSchema
>;
