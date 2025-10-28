import { BusinessStatus } from "../../auth/types/profileTypes";

/* ...imports stay… */
export interface UpdateStorePayload {
    /* required */
    businessId: string;
    businessName: string;
    categoryId: string;

    /* root (new) --------------------------------------------------- */
    street2?: string;           // 🆕
    pincode?: string;           // 🆕

    /* optional root contacts / address */
    logoId?: string;
    businessEmail?: string;
    businessPhone?: string;
    whatsappNumber?: string;
    websiteUrl?: string;
    instagramHandle?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;

    /* socials & profile */
    socialMediaLinks: { platform: string; url: string; icon?: string }[];

    businessProfile?: {
        legalName: string;
        businessTypeId?: string;
        gstNumber?: string;
        cin?: string;
        fssaiLicenseNumber?: string;

        /* address inside profile (new) ------------------------------ */
        address?: string;
        street2?: string;         // 🆕
        city?: string;
        state?: string;
        pincode?: string;         // 🆕
        country?: string;
    };
}

/* ────── what BE returns ────── */
export interface StoreResponse {
    id: string;
    businessName: string;
    status: BusinessStatus;
    categoryId: string;

    /* root contact/address ---------------------------------------- */
    address?: string;
    street2?: string;           // 🆕
    city?: string;
    state?: string;
    pincode?: string;           // 🆕
    country?: string;
    businessEmail?: string;
    businessPhone?: string;
    whatsappNumber?: string;
    websiteUrl?: string;
    instagramHandle?: string;

    socialMediaLinks?: { platform: string; url: string; icon?: string }[];

    businessProfile?: {
        legalName: string;
        gstNumber?: string;
        cin?: string;
        fssaiLicenseNumber?: string;

        /* profile address (new) ------------------------------------- */
        address?: string;
        street2?: string;         // 🆕
        city?: string;
        state?: string;
        pincode?: string;         // 🆕
        country?: string;
        businessType?: {
            id: string;
            name: string;
        };
    };
}

export type SocialMediaLink = {
    platform: string;
    url: string;
    icon?: string;
};

