import { z } from "zod";

export const sellerStoreDetailsSchema = z.object({
  businessName: z.string().nonempty("Business name is required"),
  // businessTypeId: z.string().uuid("Select a valid business type"),
  // ↓ allow any non-empty string here (either an existing UUID or a new name)
  categoryId: z.string().nonempty("Please choose or add a category"),
  websiteUrl: z.string().url("Must be a valid URL").optional(),
  instagramHandle: z.string().optional(),
  whatsappNumber: z.string().optional(),
  businessEmail: z.string().email("Invalid email").optional(),
  businessPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  logoId: z.string().uuid().optional(),
  id: z.string().uuid().optional(),
});

// this is the type you import elsewhere:
export type SellerStoreDetailsFormValues = z.infer<
  typeof sellerStoreDetailsSchema
>;
