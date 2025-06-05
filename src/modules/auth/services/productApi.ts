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

// Extend the ProductFormValues or create a new DTO if backend requires a different shape
export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
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

export interface ProductListResponse {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";
  shippingClass?: string;
  taxClass?: string;
  variant?: string;
  images?: string[]; // URL strings
  videoUrl?: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface GetProductResponse {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
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
    // ADD inside endpoints
    createProduct: builder.mutation<
      { message: string; data: CreateProductResponse },
      CreateProductRequest
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("name", body.name);
        formData.append("category", body.category);
        formData.append("price", body.price.toString());
        if (body.discountPrice)
          formData.append("discountPrice", body.discountPrice.toString());
        if (body.description) formData.append("description", body.description);
        if (body.stock !== undefined)
          formData.append("stock", body.stock.toString());
        if (body.stockStatus) formData.append("stockStatus", body.stockStatus);
        if (body.shippingClass)
          formData.append("shippingClass", body.shippingClass);
        if (body.taxClass) formData.append("taxClass", body.taxClass);
        if (body.variant) formData.append("variant", body.variant);

        if (body.images && body.images.length > 0) {
          body.images.forEach((file) => formData.append("images", file)); // Backend should handle array files
        }
        if (body.video) {
          formData.append("video", body.video);
        }

        return {
          url: `/seller/product/create`, // Your backend endpoint for product create
          method: "POST",
          body: formData,
        };
      },
    }),

    // ✅ New: List all products
    listProducts: builder.query<ProductListResponse[], void>({
      query: () => ({
        url: `/seller/product/list`, // <-- Replace with your real endpoint
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: ProductListResponse[];
      }) => raw.data,
    }),
    // ✅ New: Get Single Product
    getProduct: builder.query<GetProductResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/seller/product/${id}`,
        method: "GET",
      }),
      transformResponse: (raw: { message: string; data: GetProductResponse }) =>
        raw.data,
    }),
    // ✅ New: Update Product
    updateProduct: builder.mutation<
      { message: string; data: GetProductResponse },
      CreateProductRequest & { id: string }
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("id", body.id);
        formData.append("name", body.name);
        formData.append("category", body.category);
        formData.append("price", body.price.toString());
        if (body.discountPrice)
          formData.append("discountPrice", body.discountPrice.toString());
        if (body.description) formData.append("description", body.description);
        if (body.stock !== undefined)
          formData.append("stock", body.stock.toString());
        if (body.stockStatus) formData.append("stockStatus", body.stockStatus);
        if (body.shippingClass)
          formData.append("shippingClass", body.shippingClass);
        if (body.taxClass) formData.append("taxClass", body.taxClass);
        if (body.variant) formData.append("variant", body.variant);
        if (body.images && body.images.length > 0) {
          body.images.forEach((file) => formData.append("images", file));
        }
        if (body.video) {
          formData.append("video", body.video);
        }

        return {
          url: `/seller/product/edit`, // <-- Update endpoint
          method: "POST",
          body: formData,
        };
      },
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
  useGetProductQuery,
  useUpdateProductMutation,
} = productApi;
