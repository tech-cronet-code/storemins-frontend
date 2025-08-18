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
  price?: number;
  discountedPrice?: number;
  description?: string;
  quantity?: number;
  status?: string;
  media?: Array<{ type: "IMAGE" | "VIDEO"; url: string; order?: number }>;
  seoMetaData?: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  ParentCategory?: { id: string; name: string };
  SubCategory?: { id: string; name: string };
  // Other fields...
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
}


export interface VariantDto {
  optionName: string;
  optionValues: string[];
}

export interface ProductDetailsResponse {
  quantity: any;
  media: never[];
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description?: string;
  stock?: number;
  sku?: string;
  stockStatus?: "in_stock" | "out_of_stock";
  images?: string[];
  status: "ACTIVE" | "INACTIVE";
  shippingWeight?: number;
  hsnCode?: string;
  gstPercent?: number;
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

     // LIST BY BUSINESS
    listProducts: builder.query<ProductListItem[], { businessId: string }>({
      query: ({ businessId }) => ({ url: `/seller/product/product/list-by-business`, method: "POST", body: { businessId } }),
      transformResponse: (raw: { message: string; data: ProductResponseDto[] }): ProductListItem[] =>
        raw.data.map((p) => {
          const images = p.media?.filter((m) => m.type === "IMAGE").map((m) => m.url) || [];
          return {
            id: p.id,
            name: p.name,
            price: p.price ?? 0,
            discountedPrice: p.discountedPrice,
            description: p.description,
            stock: p.quantity,
            stockStatus: p.quantity && p.quantity > 0 ? "in_stock" : "out_of_stock",
            images,
            status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
          };
        }),
    }),


    // ➔ New: Get Product By ID
 // GET BY ID
    getProductById: builder.query<ProductDetailsResponse, { id: string }>({
      query: ({ id }) => ({ url: `/seller/product/product/get-by-id`, method: "POST", body: { id } }),
      transformResponse: (raw: { message: string; data: any }): ProductDetailsResponse => {
        const p = raw.data;
        const images = p.media?.filter((m: any) => m.type === "IMAGE").map((m: any) => m.url) || [];
        return {
          id: p.id,
          name: p.name,
          price: p.price ?? 0,
          discountedPrice: p.discountedPrice,
          description: p.description,
          stock: p.quantity,
          sku: p.sku,
          stockStatus: p.quantity > 0 ? "in_stock" : "out_of_stock",
          images,
          status: p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",

          // 🔑 Shipping & Tax
          shippingWeight: p.shippingWeight,
          hsnCode: p.hsnCode,
          gstPercent: p.gstPercent,

          // 🔑 Variants
          variants: p.variants || [],

          // Categories & SEO
          categoryLinks: p.categoryLinks || [],
          seoMetaData: {
            title: p.seoMetaData?.title || "",
            description: p.seoMetaData?.description || "",
            imageUrl: p.seoMetaData?.imageUrl || "",
          },
        };
      },
    }),
  // EDIT (multipart)
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
