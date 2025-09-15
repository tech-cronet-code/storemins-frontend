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

// pick correct API base per mode
const API_BASE =
  (import.meta.env.VITE_MODE === "production"
    ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE
    : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL) || "";

export const storefrontPublicApi = createApi({
  reducerPath: "storefrontPublicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    // credentials: "include", // only if your BE sets cookies you need on public calls
  }),
  endpoints: (builder) => ({
    // Path mode: :slug/storefront/bootstrap (BE derives tenant from path)
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
  }),
});

export const { useGetStorefrontBootstrapQuery } = storefrontPublicApi;
