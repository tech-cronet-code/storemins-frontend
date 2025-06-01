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
  imageId?: string;
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
    };
  }>;
}

export const productApi = createApi({
  baseQuery: baseQueryWithReauth, // ⬅️ Uses the smart switch
  reducerPath: "productApi",
  endpoints: (builder) => ({
    createCategory: builder.mutation<
      { message: string; data: ProductCategoryResponse },
      ProductCategoryRequest
    >({
      query: (body) => ({
        url: `/seller/product/product-category/create`, // ⬅️ NO /auth
        method: "POST",
        body,
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
      ProductCategoryRequest & { id: string } // id is required to update
    >({
      query: (body) => ({
        url: `/seller/product/product-category/edit`,
        method: "POST", 
        body,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useListCategoriesQuery,
  useLazyListCategoriesQuery,
  useUpdateCategoryMutation,
} = productApi;
