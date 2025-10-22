import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface StorefrontLayoutItemDto {
  type: "designElement";
  id: string;
  code: string;
  settings: any;
  data: any;
  position: number;
}

export interface StorefrontBranchDto {
  id: string;
  name: string;
  company_name: string;
  city: string;
  state: string;
  country: string;
  is_main_branch: number;
}

export interface StorefrontRuntimeResponseDto {
  layout: StorefrontLayoutItemDto[];
  settings: Record<string, string>;
  branches: StorefrontBranchDto[];
}

/** Category response types */
export interface ProductCategoryListResponse {
  categoryType: string;
  id: string;
  name: string;
  slug: string;
  productCount: string;
  status: string;
  description?: string;
  imageUrl?: string;
  seoMetaData?: {
    title: string;
    description: string;
    keywords?: string;
    imageUrl?: string;
  };
  subCategories?: Array<{
    id: string;
    name: string;
    status: string;
    description?: string;
    imageUrl?: string;
    seoMetaData?: {
      title: string;
      description: string;
      keywords?: string;
      imageUrl?: string;
    };
  }>;
}

/** ---------- Products (public list shape for UI) ---------- */
export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;

  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
  isRecommended?: boolean;

  // extras your UI reads
  slug?: string;
  currency?: string;
  discountPercent?: number;

  // 🔧 Make each field optional to match the API payload
  categoryLinks?: Array<{
    parentCategoryId?: string;
    parentCategoryName?: string;
    subCategoryId?: string;
    subCategoryName?: string;
  }>;

  quantity?: number;
  variant?: any;
  category?: string;
}

/** Minimal upstream DTO shape to satisfy mapping */
export interface ProductResponseDto {
  id: string;
  name: string;
  slug?: string;
  currency?: string;
  discountPercent?: number;
  price?: number | null;
  discountedPrice?: number | null;
  description?: string | null;
  quantity?: number | null;
  images?: Array<string | { url?: string }>;
  media?: Array<{ url?: string }>;
  status?: "ACTIVE" | "INACTIVE" | string;
  isRecommended?: boolean;
  categoryLinks?: Array<{
    parentCategoryId?: string;
    parentCategoryName?: string;
    subCategoryId?: string;
    subCategoryName?: string;
  }>;
}

/** Safely extract image URLs from various payload shapes */
const pluckImages = (p: ProductResponseDto): string[] => {
  const fromImages = Array.isArray(p.images)
    ? p.images
        .map((i) => (typeof i === "string" ? i : i?.url ?? ""))
        .filter(Boolean)
    : [];
  const fromMedia = Array.isArray(p.media)
    ? p.media.map((m) => m?.url ?? "").filter(Boolean)
    : [];
  // de-duplicate while preserving order
  return Array.from(new Set([...fromImages, ...fromMedia]));
};

// pick correct API base per mode
const API_BASE =
  (import.meta.env.VITE_MODE === "production"
    ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE
    : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL) || "";

export const storefrontPublicApi = createApi({
  reducerPath: "storefrontPublicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    /** Bootstrap storefront by slug (tenant auto-resolved) */
    getStorefrontBootstrap: builder.query<
      StorefrontRuntimeResponseDto,
      { slug: string }
    >({
      query: ({ slug }) => `${slug}/storefront/bootstrap`,
      transformResponse: (raw: {
        message: string;
        data: StorefrontRuntimeResponseDto;
      }) => raw.data,
    }),

    /** ✅ Public: List categories for a business */
    listPublicCategories: builder.query<
      ProductCategoryListResponse[],
      { businessId: string }
    >({
      query: ({ businessId }) =>
        `/customer/product/product-category/list/${businessId}`,
      transformResponse: (raw: {
        message: string;
        data: ProductCategoryListResponse[];
      }) => raw.data,
    }),

    /** ✅ Products by business & type (POST) */
    listPublicProducts: builder.query<
      ProductListItem[],
      { businessId: string; type: string }
    >({
      query: ({ businessId, type }) => ({
        url: `/customer/product/product/list-by-business`,
        method: "POST",
        body: { businessId, type },
      }),
      transformResponse: (raw: {
        message: string;
        data: ProductResponseDto[];
      }): ProductListItem[] =>
        (raw.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          currency: p.currency,
          discountPercent: p.discountPercent,
          price: p.price ?? 0,
          discountedPrice: p.discountedPrice ?? undefined,
          description: p.description ?? undefined,
          stock: p.quantity ?? undefined,
          stockStatus:
            p.quantity && p.quantity > 0 ? "in_stock" : "out_of_stock",
          images: pluckImages(p),
          status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
          isRecommended: p.isRecommended ?? undefined,
          // 🔧 Keep API shape, but map explicitly so TS is happy
          categoryLinks: Array.isArray(p.categoryLinks)
            ? p.categoryLinks.map((l) => ({
                parentCategoryId: l.parentCategoryId ?? undefined,
                parentCategoryName: l.parentCategoryName ?? undefined,
                subCategoryId: l.subCategoryId ?? undefined,
                subCategoryName: l.subCategoryName ?? undefined,
              }))
            : [],
        })),
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((p) => ({ type: "Product" as const, id: p.id })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetStorefrontBootstrapQuery,
  useListPublicCategoriesQuery,
  useListPublicProductsQuery,
} = storefrontPublicApi;
