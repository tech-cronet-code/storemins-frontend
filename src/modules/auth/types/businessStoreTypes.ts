// src/types/businessStoreTypes.ts

export interface BusinessDetailsRequestDto {
  businessName: string;
  businessTypeId: string;
  categoryId: string;
  websiteUrl?: string;
  instagramHandle?: string;
  whatsappNumber?: string;
  businessEmail?: string;
  businessPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoId?: string;
  id?: string; // optional for update
  userId: string;
}

export interface BusinessDetailsResponseDto {
  id: string;
  businessName: string;
  status: string;
  businessTypeId: string;
  categoryId: string;
  websiteUrl?: string | null;
  tenantId?: string | null;
  instagramHandle?: string | null;
  whatsappNumber?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  logoId?: string | null;
  ownerId: string | null;
  domain?: {
    id: string;
    domainName?: string | null;
    domain: string;
    domainType: string; // or DomainType enum
    isActive: boolean;
  };
}

// ---- new types for listing ----

export interface ListBusinessTypesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BusinessTypeResponseDto {
  id: string;
  name: string;
  type: string;
}

export interface ListBusinessCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BusinessCategoryResponseDto {
  id: string;
  name: string;
  description?: string | null;
}

/** what you send when creating or updating a category */
export interface AddUpdateBusinessCategoryRequestDto {
  /** name of the category */
  name: string;
  /** optional description (or null) */
  description?: string | null;
  /** if you’re updating an existing category, pass its UUID here */
  id?: string;
}

/** what you receive back from the server */
export interface AddUpdateBusinessCategoryResponseDto {
  /** UUID of the category */
  id: string;
  /** name of the category */
  name: string;
  /** optional description */
  description?: string | null;
}
