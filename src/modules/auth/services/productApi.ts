/* eslint-disable @typescript-eslint/no-explicit-any */
// src/common/services/productApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ProductCategoryRequest {
  name: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  categoryType: "PARENT" | "SUB";
  businessId: string;
  parentId?: string;
  // imageId?: string;
  seoMetaData?: {
    title: string;
    description: string;
    keywords?: string;
  };
}

export interface ProductCategoryResponse {
  id: string;
  name: string;
  status: string;
  categoryType: string;
  description?: string;
  imageUrl?: string;
  seoMetaData?: {
    title: string;
    description: string;
    keywords?: string;
    imageUrl?: string;
  };

  parentCategory?: {
    id: string;
    name: string;
  };
}

export interface ProductCategoryListResponse {
  categoryType: string;
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

/** ─────────────────────────────────────────────────────────────
 *  NEW: Questions + AnswerType (CHOICE_SINGLE / CHOICE_MULTI)
 *  ───────────────────────────────────────────────────────────*/
export type AnswerType =
  | "TEXT"
  | "CHOICE_SINGLE"
  | "CHOICE_MULTI"
  | "FILE_UPLOAD";

export interface ProductQuestionOptionDto {
  label: string;
  value?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ProductQuestionDto {
  order?: number;
  prompt: string;
  answerType: AnswerType;
  isRequired?: boolean;
  maxFiles?: number | null;
  maxSizeMB?: number | null;
  imageId?: string | null;
  options?: ProductQuestionOptionDto[];
  minSelect?: number | null;
  maxSelect?: number | null;
  metadata?: Record<string, unknown> | null;
}

// Extend the ProductFormValues or create a new DTO if backend requires a different shape
export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  shippingClass?: string;
  taxClass?: string;
  variant?: string;
  images?: File[]; // For file uploads
  video?: File; // Optional video file

  // NEW
  isRecommended?: boolean;
  customerQuestionsRequired?: boolean;
  postPurchaseNoteDesc?: string | null;
  questions?: ProductQuestionDto[];
}

export interface CreateProductResponse {
  id: string;
  name: string;
  status: string;
  message?: string;
}

// Product List and Get Single Product
export interface ProductListResponse {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  shippingClass?: string;
  taxClass?: string;
  variant?: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface UpdateProductStatusRequest {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  businessId: string;
}

export interface GetProductResponse {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  shippingClass?: string;
  taxClass?: string;
  variant?: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
}

/* ─────────────────────────────────────────────
 * DIGITAL typed blocks (from backend response)
 * ───────────────────────────────────────────*/
export interface ProductDigitalAssetDto {
  fileId?: string | null;
  externalUrl?: string | null;
  title?: string | null;
  sortOrder?: number | null;
}
export interface ProductDigitalDto {
  downloadLimit?: number | null;
  licenseKeyRequired?: boolean | null;
  drmProvider?: string | null;
  accessUrl?: string | null;
  expiresAt?: string | null;
  notes?: string | null;
  assets?: ProductDigitalAssetDto[];
}

/** ─────────────────────────────────────────────────────────────
 *  MEETING: DTO (server returns Meeting relation as `meeting`)
 *  ───────────────────────────────────────────────────────────*/
export interface MeetingDto {
  startsAt: string;
  endsAt: string;
  timezone: string;
  durationMinutes: number;
  breakdown?: any | null;
  provider?: string | null;
  meetingLink?: string | null;
  capacity?: number | null;
  hostName?: string | null;
  recurrence?: any | null;
  instructions?: string | null;
}

/** Backend response DTO */
interface ProductResponseDto {
  id: string;
  name: string;
  type?: "PHYSICAL" | "DIGITAL" | "MEETING" | "WORKSHOP";
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
  isArchived?: boolean;

  // flags + note
  isRecommended?: boolean;
  customerQuestionsRequired?: boolean;
  postPurchaseNoteDesc?: string | null;

  // pricing/meta/content
  price?: number | null;
  discountedPrice?: number | null;
  description?: string | null;
  quantity?: number | null;
  sku?: string | null;
  shippingWeight?: number | null;
  hsnCode?: string | null;
  gstPercent?: number | null;

  media?: Array<{ type: "IMAGE" | "VIDEO"; url: string; order?: number }>;
  variants?: Array<{ optionName: string; optionValues: string[] }>;

  seoMetaData?: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  categoryLinks?: Array<{
    parentCategoryId?: string;
    parentCategoryName?: string;
    subCategoryId?: string;
    subCategoryName?: string;
  }>;

  questions?: ProductQuestionDto[];

  // Meeting relation (present for type=MEETING)
  meeting?: MeetingDto | null;

  // Digital (still supported elsewhere)
  digital?: {
    assets?: Array<{
      fileId?: string | null;
      externalUrl?: string | null;
      title?: string | null;
      sortOrder?: number | null;
    }>;
  } | null;
}

// types/products.ts
export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;

  // existing fields your UI uses
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
  isRecommended?: boolean;

  // make these OPTIONAL so the mapper isn't forced to supply them
  quantity?: number;
  categoryLinks?: Array<{
    parentCategoryId: string;
    parentCategoryName: string;
  }>;
  variant?: any; // or the real type if you have one
  category?: string; // convenient string for first/combined category name
}

export interface VariantDto {
  optionName: string;
  optionValues: string[];
}

// add alongside your other DTOs
export interface DigitalAssetDto {
  fileId?: string | null;
  externalUrl?: string | null;
  title?: string | null;
  sortOrder?: number | null;
}

export interface ProductDetailsResponse {
  id: string;
  name: string;

  // flags
  isRecommended?: boolean;
  customerQuestionsRequired?: boolean;
  postPurchaseNoteDesc?: string | null;

  // pricing/meta/content
  price: number;
  discountedPrice?: number | null;
  description?: string | null;
  stock?: number;
  sku?: string | null;
  stockStatus?: "in_stock" | "out_of_stock";
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
  shippingWeight?: number | null;
  hsnCode?: string | null;
  gstPercent?: number | null;

  variants?: VariantDto[];

  categoryLinks: Array<{
    parentCategoryId?: string;
    parentCategoryName?: string;
    subCategoryId?: string;
    subCategoryName?: string;
  }>;

  seoMetaData?: { title?: string; description?: string; imageUrl?: string };

  // Questions
  questions?: ProductQuestionDto[];

  // ── MEETING helpers for easy hydrate
  meeting?: MeetingDto | null;
  meetingDuration?: number; // minutes
  meetingDurationUnit?: "mins"; // UI convenience
  meetingBreakdown?: string; // free text extracted from meeting.breakdown
  meetingChannel?: string | null; // provider echo
}

/** Utility */
const pluckImages = (p: ProductResponseDto) =>
  p.media?.filter((m) => m.type === "IMAGE").map((m) => m.url) || [];

export const productApi = createApi({
  baseQuery: baseQueryWithReauth, // ⬅️ Uses the smart switch
  reducerPath: "productApi",
  endpoints: (builder) => ({
    createCategory: builder.mutation<
      { message: string; data: ProductCategoryResponse },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product-category/create`,
        method: "POST",
        body: formData,
      }),
    }),
    listCategories: builder.query<
      ProductCategoryListResponse[],
      { businessId: string }
    >({
      query: ({ businessId }) => ({
        url: `/seller/product/product-category/list/${businessId}`, // ⬅️ NO /auth
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: ProductCategoryListResponse[];
      }) => raw.data,
    }),

    updateCategory: builder.mutation<
      { message: string; data: ProductCategoryResponse },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product-category/edit`,
        method: "POST",
        body: formData,
      }),
    }),

    //  getCategory endpoint
    getCategory: builder.query<
      ProductCategoryResponse,
      { id: string; type: "PARENT" | "SUB" }
    >({
      query: ({ id, type }) => ({
        url: `/seller/product/product-category/${id}?type=${type}`,
        method: "GET",
      }),
      transformResponse: (response: {
        message: string;
        data: ProductCategoryResponse;
      }) => response.data,
    }),

    deleteCategories: builder.mutation<
      { message: string }, // response type
      { ids: string[] } // payload
    >({
      query: (body) => ({
        url: `/seller/product/product-category/delete`,
        method: "DELETE",
        body,
      }),
    }),
    // CREATE (multipart) — PHYSICAL/GENERIC
    createProduct: builder.mutation<
      { message: string; data: { id: string; name: string } },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product/create`,
        method: "POST",
        body: formData,
      }),
    }),

    /* ─────────────────────────────────────────────
     * DIGITAL: CREATE / EDIT (multipart)
     * ───────────────────────────────────────────*/
    createDigitalProduct: builder.mutation<
      { message: string; data: { id: string; name: string } },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product/digital/create`,
        method: "POST",
        body: formData,
      }),
    }),
    updateDigitalProduct: builder.mutation<
      { message: string; data: ProductDetailsResponse },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product/digital/edit`,
        method: "POST",
        body: formData,
      }),
    }),

    /** ─────────────────────────────────────────────
     *  MEETING endpoints (NEW)
     *  ───────────────────────────────────────────*/
    createMeetingProduct: builder.mutation<
      { message: string; data: { id: string; name: string } },
      FormData
    >({
      query: (formData) => ({
        // Controller decorator shows 'product/meeting/create'
        // Full path matches existing pattern with '/product' group:
        url: `/seller/product/product/meeting/create`,
        method: "POST",
        body: formData,
      }),
    }),
    updateMeetingProduct: builder.mutation<
      { message: string; data: ProductDetailsResponse },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product/meeting/edit`,
        method: "POST",
        body: formData,
      }),
    }),

    /** LIST by business/type (unchanged) */
    listProducts: builder.query<
      ProductListItem[],
      { businessId: string; type: string }
    >({
      query: ({ businessId, type }) => ({
        url: `/seller/product/product/list-by-business`,
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
          price: p.price ?? 0,
          discountedPrice: p.discountedPrice ?? undefined,
          description: p.description ?? undefined,
          stock: p.quantity ?? undefined,
          stockStatus:
            p.quantity && p.quantity > 0 ? "in_stock" : "out_of_stock",
          images: pluckImages(p),
          status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
          isRecommended: p.isRecommended ?? undefined,
        })),
    }),

    /** GET BY ID — hydrate Meeting helpers */
    getProductById: builder.query<ProductDetailsResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/seller/product/product/get-by-id`,
        method: "POST",
        body: { id },
      }),
      transformResponse: (raw: {
        message: string;
        data: ProductResponseDto;
      }): ProductDetailsResponse => {
        const p = raw.data;
        const images = pluckImages(p);

        // Meeting helpers
        const mtg = p.meeting ?? null;
        const meetingDuration = mtg?.durationMinutes ?? undefined;

        // breakdown can be string or object; normalize to string for the form textarea
        let meetingBreakdown: string | undefined;
        if (mtg?.breakdown != null) {
          if (typeof mtg.breakdown === "string")
            meetingBreakdown = mtg.breakdown;
          else if (typeof mtg.breakdown === "object" && "text" in mtg.breakdown)
            meetingBreakdown = String((mtg.breakdown as any).text ?? "");
          else meetingBreakdown = JSON.stringify(mtg.breakdown);
        }

        return {
          id: p.id,
          name: p.name,
          isRecommended: p.isRecommended ?? false,
          customerQuestionsRequired: p.customerQuestionsRequired ?? false,
          postPurchaseNoteDesc: p.postPurchaseNoteDesc ?? null,

          price: p.price ?? 0,
          discountedPrice: p.discountedPrice ?? null,
          description: p.description ?? null,
          stock: p.quantity ?? undefined,
          sku: p.sku ?? null,
          stockStatus: (p.quantity ?? 0) > 0 ? "in_stock" : "out_of_stock",
          images,
          status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",

          shippingWeight: p.shippingWeight ?? null,
          hsnCode: p.hsnCode ?? null,
          gstPercent: p.gstPercent ?? null,

          variants: p.variants || [],
          categoryLinks: p.categoryLinks || [],

          seoMetaData: {
            title: p.seoMetaData?.title || "",
            description: p.seoMetaData?.description || "",
            imageUrl: p.seoMetaData?.imageUrl || "",
          },

          questions: p.questions || [],

          // Meeting echoes for the form
          meeting: mtg,
          meetingDuration,
          meetingDurationUnit: "mins",
          meetingBreakdown,
          meetingChannel: mtg?.provider ?? null,
        };
      },
    }),

    // EDIT (multipart)
    updateProduct: builder.mutation<
      { message: string; data: ProductDetailsResponse },
      FormData
    >({
      query: (formData) => ({
        url: `/seller/product/product/edit`,
        method: "POST",
        body: formData,
      }),
    }),

    updateProductStatus: builder.mutation<
      { message: string; data: { id: string; status: string } },
      UpdateProductStatusRequest
    >({
      query: (body) => ({
        url: `/seller/product/product/update-status`,
        method: "POST",
        body,
      }),
      async onQueryStarted(
        { id, status },
        { dispatch, queryFulfilled, getState }
      ) {
        const state: any = getState();
        const businessId = state.auth.userDetails?.storeLinks?.[0]?.businessId;
        const patchResult = dispatch(
          productApi.util.updateQueryData(
            "listProducts",
            { businessId, type: "" },
            (draft) => {
              const product = draft.find((p) => p.id === id);
              if (product) product.status = status;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteProduct: builder.mutation<
      { message: string; data: { id: string } },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/seller/product/product/delete`,
        method: "POST",
        body: { id },
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useListCategoriesQuery,
  useLazyListCategoriesQuery,
  useUpdateCategoryMutation,
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useDeleteCategoriesMutation,
  // PHYSICAL/GENERIC
  useCreateProductMutation,
  useListProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,

  // DIGITAL
  useCreateDigitalProductMutation,
  useUpdateDigitalProductMutation,

  // MEETING (NEW)
  useCreateMeetingProductMutation,
  useUpdateMeetingProductMutation,
} = productApi;
