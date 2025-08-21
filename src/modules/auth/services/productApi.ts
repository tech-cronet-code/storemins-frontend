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
 *  NEW: Questions + AnswerType
 *  ───────────────────────────────────────────────────────────*/
export type AnswerType = "TEXT" | "YES_NO" | "FILE_UPLOAD";

export interface ProductQuestionDto {
  order?: number;
  prompt: string;
  answerType: AnswerType;
  isRequired?: boolean;
  maxFiles?: number | null;
  maxSizeMB?: number | null;
  metadata?: Record<string, unknown> | null;
  // isActive?: boolean; // backend defaults to true; omit in payload unless you need it
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

// Backend response DTO
interface ProductResponseDto {
  id: string;
  name: string;
  type?: "PHYSICAL" | "DIGITAL" | "MEETING" | "WORKSHOP";
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
  isArchived?: boolean;

  // NEW FLAGS
  isRecommended?: boolean;
  customerQuestionsRequired?: boolean;

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

  // NEW: Questions echo
  questions?: ProductQuestionDto[];
}

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
   // optional surfacing of recommended in list if you want:
  isRecommended?: boolean;
}


export interface VariantDto {
  optionName: string;
  optionValues: string[];
}

export interface ProductDetailsResponse {
  id: string;
  name: string;

  // flags
  isRecommended?: boolean;
  customerQuestionsRequired?: boolean;

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

  seoMetaData?: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  // NEW
  questions?: ProductQuestionDto[];
}

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
   // CREATE (multipart)
    createProduct: builder.mutation<{ message: string; data: { id: string; name: string } }, FormData>({
      query: (formData) => ({ url: `/seller/product/product/create`, method: "POST", body: formData }),
    }),

    // LIST BY BUSINESS — include isRecommended if you want it in card/list
    listProducts: builder.query<ProductListItem[], { businessId: string }>({
      query: ({ businessId }) => ({
        url: `/seller/product/product/list-by-business`,
        method: "POST",
        body: { businessId },
      }),
      transformResponse: (raw: { message: string; data: ProductResponseDto[] }): ProductListItem[] =>
        (raw.data || []).map((p) => {
          const images = p.media?.filter((m) => m.type === "IMAGE").map((m) => m.url) || [];
          return {
            id: p.id,
            name: p.name,
            price: p.price ?? 0,
            discountedPrice: p.discountedPrice ?? undefined,
            description: p.description ?? undefined,
            stock: p.quantity ?? undefined,
            stockStatus: p.quantity && p.quantity > 0 ? "in_stock" : "out_of_stock",
            images,
            status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
            isRecommended: p.isRecommended ?? undefined,
          };
        }),
    }),


    // ➔ New: Get Product By ID
 // GET BY ID

    // GET BY ID — hydrate flags + questions
    getProductById: builder.query<ProductDetailsResponse, { id: string }>({
      query: ({ id }) => ({ url: `/seller/product/product/get-by-id`, method: "POST", body: { id } }),
      transformResponse: (raw: { message: string; data: ProductResponseDto }): ProductDetailsResponse => {
        const p = raw.data;
        const images = p.media?.filter((m) => m.type === "IMAGE").map((m) => m.url) || [];
        return {
          id: p.id,
          name: p.name,
          // flags
          isRecommended: p.isRecommended ?? false,
          customerQuestionsRequired: p.customerQuestionsRequired ?? false,

          // pricing/meta/content
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

          // NEW
          questions: p.questions || [],
        };
      },
    }),
 // EDIT (multipart) — unchanged signature
    updateProduct: builder.mutation<{ message: string; data: ProductDetailsResponse }, FormData>({
      query: (formData) => ({ url: `/seller/product/product/edit`, method: "POST", body: formData }),
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
      // ✅ Add optimistic UI update
      async onQueryStarted(
        { id, status },
        { dispatch, queryFulfilled, getState }
      ) {
        const state: any = getState();
        const businessId = state.auth.userDetails?.storeLinks?.[0]?.businessId;

        const patchResult = dispatch(
          productApi.util.updateQueryData(
            "listProducts",
            { businessId },
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
  useCreateProductMutation,
  useListProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productApi;
