//  apiClient.ts for REGISTER

import { createApi } from "@reduxjs/toolkit/query/react";
import { StoreResponse, UpdateStorePayload } from "../../seller/types/storeTypes";
import { UserRoleName } from "../constants/userRoles";
import {
  AddUpdateBusinessCategoryRequestDto,
  AddUpdateBusinessCategoryResponseDto,
  BusinessCategoryResponseDto,
  BusinessDetailsRequestDto,
  BusinessDetailsResponseDto,
  BusinessTypeResponseDto,
} from "../types/businessStoreTypes";
import {
  DomainRequestDto,
  DomainResponseDto,
  DomainWithSSLResponseDto,
  ListDomainsParams,
} from "../types/domainTypes";
import { GetMyProfileDto } from "../types/profileTypes";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface RegisterPayload {
  name: string;
  mobile: string;
  pass_hash: string;
  role: UserRoleName;
  isTermAndPrivarcyEnable: boolean;
}

export interface RegisterResponse {
  id: string;
  message?: string;
  needs_confirm_otp_code: boolean;
  quickLoginEnable: boolean;
  quickRegisterInfo?: {
    id: string;
    mobile: string;
    role?: string[]; // or UserRoleName[]
    permissions?: string[];
    access_token: string;
    refresh_token: string;
    tenentId?: string | null;
    mobile_confirmed: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    quickLoginInfo: {
      id: string;
      name?: string;
      mobile: string;
      role?: string[]; // or UserRoleName[]
      permissions?: string[];
      access_token: string;
      refresh_token: string;
      tenentId?: string | null;
      mobile_confirmed: boolean;
    };
    needs_confirm_otp_code: boolean;
    otpExpiresAt: string;
  };
}

interface LoginPayload {
  mobile: string;
  password: string;
}

// Add these imports at top
interface ConfirmMobileOtpPayload {
  mobile: string;
  confirm_mobile_otp_code: string;
}

interface ConfirmMobileOtpResponse {
  id: string;
  mobile: string;
  mobile_confirmed: boolean;
  message?: string;
}

interface ResendMobileOtpPayload {
  mobile: string;
  userId?: string;
}
interface ResendMobileOtpResponse {
  message: string;
  expiresAt: string;
}
interface UpdateProfileRequestDto {
  name: string;
}

interface UpdateProfileResponseDto {
  id: string;
  name: string;
  mobile: string;
}

export const apiClient = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "apiClient",
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: RegisterResponse;
      }) => {
        return {
          ...raw.data,
          message: raw.message,
        };
      },
    }),
    getUserDetails: builder.query<GetMyProfileDto, void>({
      query: () => ({
        url: "/my-profile",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: GetMyProfileDto;
      }) => raw.data, // 👈 unwrap so hook returns clean DTO
    }),
    confirmOtp: builder.mutation<
      ConfirmMobileOtpResponse,
      ConfirmMobileOtpPayload
    >({
      query: (body) => ({
        url: "/confirm-mobile-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<
      ResendMobileOtpResponse,
      ResendMobileOtpPayload
    >({
      query: (body) => ({
        url: "/resend-mobile-otp",
        method: "POST",
        body,
      }),
    }),

    // // ➊ list business types
    // listBusinessTypes: builder.query<
    //   { data: BusinessTypeResponseDto[]; total: number },
    //   ListBusinessTypesParams
    // >({
    //   query: ({ page = 1, limit = 25, search }) => ({
    //     url: "/super-admin/seller/business-types/list",
    //     method: "GET",
    //     params: { page, limit, search },
    //   }),
    // }),

    // // ➋ list business categories
    // listBusinessCategories: builder.query<
    //   { data: BusinessCategoryResponseDto[]; total: number },
    //   ListBusinessCategoriesParams
    // >({
    //   query: ({ page = 1, limit = 25, search }) => ({
    //     url: "/super-admin/business-categories/list",
    //     method: "GET",
    //     params: { page, limit, search },
    //   }),
    // }),

    // ───────────────────────────────────────────────
    // ➊ list business types → returns the array directly
    listBusinessTypes: builder.query<
      BusinessTypeResponseDto[], // <-- now the hook returns an array
      void
    >({
      query: () => ({
        url: "/super-admin/seller/business-types/list",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: { data: BusinessTypeResponseDto[]; total: number };
      }) => {
        return raw.data.data; // BusinessTypeResponseDto[]
      },
    }),

    // ───────────────────────────────────────────────
    // ➋ list business categories → returns the array directly
    listBusinessCategories: builder.query<
      BusinessCategoryResponseDto[], // <-- hook returns an array
      void
    >({
      query: () => ({
        url: "/super-admin/business-categories/list",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: { data: BusinessCategoryResponseDto[]; total: number };
      }) => {
        return raw.data.data; // BusinessCategoryResponseDto[]
      },
    }),

    // ➤ create or update a business category
    createOrUpdateBusinessCategory: builder.mutation<
      AddUpdateBusinessCategoryResponseDto,
      AddUpdateBusinessCategoryRequestDto
    >({
      query: (body) => ({
        url: "/super-admin/business-categories",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        message: string;
        data: BusinessCategoryResponseDto | null;
      }) => {
        if (!raw.data) {
          throw new Error("Category already exists");
        }
        return raw.data; // <-- unwrap the `data` field
      },
    }),

    createOrUpdateBusinessDetails: builder.mutation<
      { message: string; data: BusinessDetailsResponseDto },
      BusinessDetailsRequestDto
    >({
      query: (body) => ({
        url: "/seller/business/business-details",
        method: "POST",
        body,
      }),
    }),

    // ── ➊ list/search domains ──
    listDomains: builder.query<
      { data: DomainResponseDto[]; total: number },
      ListDomainsParams
    >({
      query: ({ search }) => ({
        url: "/seller/business/domains/list",
        method: "GET",
        params: { search },
      }),
      transformResponse: (raw: {
        message: string;
        data: { data: DomainResponseDto[]; total: number };
      }) => ({
        data: raw.data.data,
        total: raw.data.total,
      }),
    }),

    // ── ➋ create or update a domain ──
    createOrUpdateDomain: builder.mutation<DomainResponseDto, DomainRequestDto>(
      {
        query: (body) => ({
          url: "/seller/business/domain",
          method: "POST",
          body,
        }),
        transformResponse: (raw: {
          message: string;
          data: DomainResponseDto;
        }) => raw.data,
      }
    ),
    // ⬇️ Add this mutation
    updateUserProfile: builder.mutation<
      UpdateProfileResponseDto,
      UpdateProfileRequestDto
    >({
      query: (body) => ({
        url: "/my-profile", // Your backend path
        method: "PUT",
        body,
      }),
    }),

    /* ───────── GET /seller/business/stores/me ───────── */
    getMyStore: builder.query<StoreResponse, void>({
      query: () => ({
        url: '/seller/business/stores/me',
        method: 'GET',
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: StoreResponse;
      }) => raw.data,
    }),

    /* ───────── POST /seller/business/stores/update ───── */
    updateStore: builder.mutation<StoreResponse, UpdateStorePayload>({
      query: (body) => ({
        url: '/seller/business/stores/update',
        method: 'POST',
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: StoreResponse;
      }) => raw.data,
    }),

    // ───────── GET /seller/business/domains/me ─────────
    getMyDomain: builder.query<DomainWithSSLResponseDto, void>({
      query: () => ({
        url: "/seller/business/domains/me",
        method: "GET",
      }),
      transformResponse: (raw: {
        message: string;
        data: DomainWithSSLResponseDto;
      }) => raw.data,
    }),
  }),

});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
  useConfirmOtpMutation,
  useResendOtpMutation,
  useListBusinessTypesQuery,
  useListBusinessCategoriesQuery,
  useCreateOrUpdateBusinessCategoryMutation,
  useCreateOrUpdateBusinessDetailsMutation,
  useListDomainsQuery,
  useLazyListDomainsQuery,
  useCreateOrUpdateDomainMutation,
  useUpdateUserProfileMutation,
  useGetMyStoreQuery,
  useUpdateStoreMutation,
  useGetMyDomainQuery,
} = apiClient;
