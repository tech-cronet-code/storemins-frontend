import { z } from "zod";


export const urlOrEmpty = z
    .string()
    .trim()
    .refine(
        (v) => v === "" || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v),
        "Enter a valid URL starting with http(s)://"
    );



export const storeSettingsSchema = z.object({
    /* identifiers */
    businessId: z.string().uuid(),

    /* basic */
    businessName: z.string().min(1, "Store name is required"),
    categoryId: z.string().min(1, "Category is required"),

    /* contacts */
    businessEmail: z.string().email().optional(),
    businessPhone: z.string().min(10).optional(),
    whatsappNumber: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    instagramHandle: z.string().optional(),

    /* address (root) */
    address: z.string().optional(),
    street2: z.string().optional(), // 🆕
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(), // 🆕
    country: z.string().optional(),

    /* nested profile */
    businessProfile: z.object({
        legalName: z.string().min(1),
        businessTypeId: z.string().optional(),
        businessTypeName: z.string().optional(),   // ⭐ add for display fallback


        gstNumber: z.string().optional(),
        cin: z.string().optional(),
        fssaiLicenseNumber: z.string().optional(),

        /* profile address */
        address: z.string().optional(),
        street2: z.string().optional(), // 🆕
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().optional(), // 🆕
        country: z.string().optional(),
    }),

    /* social */
    socialMediaLinks: z
        .array(
            z.object({
                platform: z.string().min(1),
                url: urlOrEmpty,
                icon: z.string().optional(),
            })
        )
        .default([]),
});
