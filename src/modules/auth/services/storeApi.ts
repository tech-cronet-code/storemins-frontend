// storeApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

/* =======================
   Shared DTOs (frontend)
   ======================= */
export interface StoreResponseDto {
  id: string;
  // add more fields as your UI needs
  [k: string]: any;
}

export interface UpdateStoreDto {
  // define your update payload fields here
  [k: string]: any;
}

/* ----- Timings ----- */
export interface StoreTimingItemDto {
  day: string; // e.g., "MONDAY"
  open: string; // "09:00"
  close: string; // "18:00"
  isClosed?: boolean;
}
export interface StoreTimingsRequestDto {
  storeId: string;
  timings: StoreTimingItemDto[];
}
export interface StoreTimingResponseDto {
  storeId: string;
  timings: StoreTimingItemDto[];
}

/* ----- Warehouse ----- */
export interface WarehouseUpsertRequestDto {
  id?: string;
  businessId: string;
  warehouseName: string;
  contactPerson?: string;
  mobileNumber?: string;
  flatHouseNo?: string;
  areaStreet?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string | null;
  terms?: string | null;
}
export interface WarehouseResponseDto {
  id: string;
  warehouseName: string;
  contactPerson?: string;
  mobileNumber?: string;
  fullAddress?: string;
  gstNumber?: string;
  terms?: string;
}
export type WarehouseListResponseDto = WarehouseResponseDto;
export interface DeletedWarehouseResponseDto {
  id: string;
}

/* ----- Themes (Lists / Current / Element / Switch / Publish) ----- */
export interface ThemeListItem {
  id: string;
  name: string;
  is_current: number; // 1 | 0
}

export interface AvailableDesignElementDto {
  id: string;
  name: string;
  code: string;
  settings: string; // stringified
  settings_schema?: any | null;
  can_be_multiple: number; // 1 | 0
  created_at: null;
  updated_at: null;
}

export interface ThemeDetailsDto {
  id: string;
  name: string;
  description: null;
  short_description: string;
  author: string;
  version: string;
  image?: string | null;
  branch_id: string; // businessStoreId
  created_at: string;
  updated_at: string;
}

export interface PlacedDesignElementDto {
  id: string;
  name: string;
  custom_name?: string | null;
  code: string;
  position: number;
  settings: string; // stringified
  is_active: number;
  is_plugin: number;
  settings_schema?: any | null;
}

export interface GetCurrentThemeResponseDto {
  theme_details: ThemeDetailsDto;
  design_elements: PlacedDesignElementDto[];
}

export interface SingleDesignElementPropertiesDto {
  id: string;
  theme_id: string;
  name: string;
  custom_name?: string | null;
  branch_id?: string | null;
  code: string;
  design_element_id?: string | null;
  position: number;
  settings: any; // parsed object
  is_active: number;
  is_plugin: number;
  design_plugin_id: null;
  created_at: string;
  updated_at: string;
  source: "tenant";
}
export interface GetSingleDesignElementResponseDto {
  properties: SingleDesignElementPropertiesDto;
}

export interface SwitchThemeRequestDto {
  themeId: string;
}
export interface SwitchThemeResponseDto {
  ok: boolean;
}

export interface PublishThemeResponseDto {
  ok: boolean;
  snapshot_id: string;
}

/* ----- Blocks CRUD ----- */
export interface CreateBlockRequestDto {
  design_element_id?: string;
  code?: string;
  name: string;
  custom_name?: string;
  position?: number;
  settings?: any;
  is_active?: boolean | number;
}
export interface CreateBlockResponseDto {
  id: string;
}
export interface UpdateBlockRequestDto {
  name?: string;
  custom_name?: string;
  position?: number;
  settings?: any;
  is_active?: boolean | number;
}
export interface UpdateBlockResponseDto {
  ok: true;
  id: string;
}
export interface DeleteBlockResponseDto {
  ok: true;
}

/* ----- NEW: Storefront runtime (published layout + settings) ----- */
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
  is_active: number;
  is_main_branch: number;
}
export interface StorefrontRuntimeResponseDto {
  layout: StorefrontLayoutItemDto[];
  settings: Record<string, string>;
  branches: StorefrontBranchDto[];
}

/* ==========================================
   API
   ========================================== */
export const storeApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "storeApi",
  tagTypes: [
    "Store",
    "StoreTimings",
    "Warehouse",
    "Theme",
    "Blocks",
    "DesignCatalog",
  ] as const,
  endpoints: (builder) => ({
    /* -------- Store details -------- */
    getMyStoreDetails: builder.query<StoreResponseDto, void>({
      query: () => ({
        url: `/seller/business/stores/me`,
        method: "GET",
      }),
      transformResponse: (raw: { message: string; data: StoreResponseDto }) =>
        raw.data,
      providesTags: ["Store"],
    }),

    updateStoreDetails: builder.mutation<
      { message: string; data: StoreResponseDto },
      UpdateStoreDto
    >({
      query: (body) => ({
        url: `/seller/business/stores/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* -------- Store timings -------- */
    upsertStoreTimings: builder.mutation<
      { message: string; data: StoreTimingResponseDto },
      StoreTimingsRequestDto
    >({
      query: (body) => ({
        url: `/seller/business/upsert`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["StoreTimings"],
    }),

    getStoreTimings: builder.query<
      StoreTimingResponseDto[],
      { storeId: string }
    >({
      query: ({ storeId }) => ({
        url: `/seller/business/${storeId}`,
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: StoreTimingResponseDto[];
      }) => raw.data,
      providesTags: ["StoreTimings"],
    }),

    /* -------- Warehouses -------- */
    upsertWarehouse: builder.mutation<
      { message: string; data: WarehouseResponseDto },
      WarehouseUpsertRequestDto
    >({
      query: (body) => ({
        url: `/seller/business/warehouse/upsert`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Warehouse"],
    }),

    listWarehousesByBusiness: builder.query<
      WarehouseListResponseDto[],
      { businessId: string }
    >({
      query: ({ businessId }) => ({
        url: `/seller/business/warehouse/list/${businessId}`,
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: WarehouseListResponseDto[];
      }) => raw.data,
      providesTags: ["Warehouse"],
    }),

    deleteWarehouse: builder.mutation<
      { message: string; data: DeletedWarehouseResponseDto },
      { id: string }
    >({
      query: (body) => ({
        url: `/seller/business/warehouse/delete`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Warehouse"],
    }),

    /* -------- Themes: list / current / element -------- */
    listThemesByBusiness: builder.query<
      ThemeListItem[],
      { businessId: string }
    >({
      query: ({ businessId }) => ({
        url: `/seller/business/theme/list/${businessId}`,
        method: "GET",
      }),
      // response = { data: [ { themes: [...] } ] }
      transformResponse: (raw: {
        message: string;
        data: Array<{ themes: ThemeListItem[] }>;
      }) => raw.data?.[0]?.themes ?? [],
      providesTags: ["Theme"],
    }),

    getAvailableDesignElements: builder.query<
      AvailableDesignElementDto[],
      void
    >({
      query: () => ({
        url: `/seller/business/design/get-available-design-elements`,
        method: "GET",
      }),
      // response = { data: [ { items: [...] } ] }
      transformResponse: (raw: {
        message: string;
        data: Array<{ items: AvailableDesignElementDto[] }>;
      }) => raw.data?.[0]?.items ?? [],
      providesTags: ["DesignCatalog"],
    }),

    getCurrentTheme: builder.query<
      GetCurrentThemeResponseDto,
      { businessStoreId: string }
    >({
      query: ({ businessStoreId }) => ({
        url: `/seller/business/${businessStoreId}/theme/current`,
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: GetCurrentThemeResponseDto;
      }) => raw.data,
      providesTags: ["Theme", "Blocks"],
    }),

    getSingleDesignElement: builder.query<
      GetSingleDesignElementResponseDto,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/seller/business/themes/design-elements/${id}`,
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: GetSingleDesignElementResponseDto;
      }) => raw.data,
      providesTags: ["Blocks"],
    }),

    /* -------- Themes: switch / publish -------- */
    switchTheme: builder.mutation<
      SwitchThemeResponseDto,
      { businessStoreId: string; themeId: string }
    >({
      query: ({ businessStoreId, themeId }) => ({
        url: `/seller/business/${businessStoreId}/themes/switch`,
        method: "POST",
        body: { themeId },
      }),
      transformResponse: (raw: {
        message: string;
        data: SwitchThemeResponseDto;
      }) => raw.data,
      invalidatesTags: ["Theme", "Blocks"],
    }),

    publishTheme: builder.mutation<
      PublishThemeResponseDto,
      { businessStoreId: string }
    >({
      query: ({ businessStoreId }) => ({
        url: `/seller/business/${businessStoreId}/theme/publish`,
        method: "POST",
      }),
      transformResponse: (raw: {
        message: string;
        data: PublishThemeResponseDto;
      }) => raw.data,
      invalidatesTags: ["Theme"],
    }),

    /* -------- NEW: Storefront runtime (published snapshot or draft fallback) -------- */
    getStorefrontData: builder.query<
      StorefrontRuntimeResponseDto,
      { businessStoreId: string }
    >({
      query: ({ businessStoreId }) => ({
        url: `/seller/business/${businessStoreId}/storefront/get-data`,
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: StorefrontRuntimeResponseDto;
      }) => raw.data,
      // This is read-only runtime data; no tags needed.
    }),

    /* -------- Blocks CRUD -------- */
    createBlock: builder.mutation<
      CreateBlockResponseDto,
      { businessStoreId: string; themeId: string; body: CreateBlockRequestDto }
    >({
      query: ({ businessStoreId, themeId, body }) => ({
        url: `/seller/business/${businessStoreId}/themes/${themeId}/blocks`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        message: string;
        data: CreateBlockResponseDto;
      }) => raw.data,
      invalidatesTags: ["Blocks"],
    }),

    updateBlock: builder.mutation<
      UpdateBlockResponseDto,
      { id: string; body: UpdateBlockRequestDto }
    >({
      query: ({ id, body }) => ({
        url: `/seller/business/themes/blocks/${id}`,
        method: "POST", // matches your controller decorator
        body,
      }),
      transformResponse: (raw: {
        message: string;
        data: UpdateBlockResponseDto;
      }) => raw.data,
      invalidatesTags: ["Blocks"],
    }),

    deleteBlock: builder.mutation<DeleteBlockResponseDto, { id: string }>({
      query: ({ id }) => ({
        url: `/seller/business/themes/blocks/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: {
        message: string;
        data: DeleteBlockResponseDto;
      }) => raw.data,
      invalidatesTags: ["Blocks"],
    }),
  }),
});

export const {
  // Store
  useGetMyStoreDetailsQuery,
  useUpdateStoreDetailsMutation,

  // Timings
  useUpsertStoreTimingsMutation,
  useGetStoreTimingsQuery,

  // Warehouses
  useUpsertWarehouseMutation,
  useListWarehousesByBusinessQuery,
  useDeleteWarehouseMutation,

  // Themes
  useListThemesByBusinessQuery,
  useGetAvailableDesignElementsQuery,
  useGetCurrentThemeQuery,
  useGetSingleDesignElementQuery,
  useSwitchThemeMutation,
  usePublishThemeMutation,

  // NEW: Storefront runtime
  useGetStorefrontDataQuery,

  // Blocks
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
} = storeApi;
