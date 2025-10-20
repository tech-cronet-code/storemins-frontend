// sellerApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { sellerBaseQueryWithReauth } from "./sellerBaseQueryWithReauth";

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
import { UserRoleName } from "../constants/userRoles";

import {
  UploadedFileResponse,
  UploadImagePayload,
} from "../types/imageUploadTypes";
import {
  StoreResponse,
  UpdateStorePayload,
} from "../../seller/types/storeTypes";

/* ---------- Auth DTOs ---------- */
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
    role?: string[];
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
      role?: string[];
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

interface ConfirmMobileOtpPayload {
  mobile: string;
  confirm_mobile_otp_code: string;
}

interface ResendMobileOtpPayload {
  mobile: string;
  userId?: string;
}

interface ResendMobileOtpResponse {
  message: string;
  expiresAt: string;
}

export interface JwtResponseDto {
  id: string;
  name?: string;
  mobile: string;
  role?: UserRoleName[] | string[];
  permissions?: string[];
  access_token: string;
  refresh_token?: string | null;
  tenentId?: string | null;
  mobile_confirmed?: boolean;
}

export const sellerApi = createApi({
  baseQuery: sellerBaseQueryWithReauth,
  reducerPath: "sellerApi",
  endpoints: (builder) => ({
    /* ======================= SELLER AUTH ======================= */
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: RegisterResponse;
      }) => ({
        ...raw.data,
        message: raw.message,
      }),
    }),

    // OTP confirm (seller)
    confirmOtp: builder.mutation<JwtResponseDto, ConfirmMobileOtpPayload>({
      query: (body) => ({
        url: "/auth/confirm-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: JwtResponseDto;
      }) => raw.data,
    }),

    // OTP resend (seller)
    resendOtp: builder.mutation<
      ResendMobileOtpResponse,
      ResendMobileOtpPayload
    >({
      query: (body) => ({
        url: "/auth/resend-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: ResendMobileOtpResponse;
      }) => raw.data,
    }),

    // logout (seller)
    logout: builder.mutation<
      { message: string; statusCode: number },
      { access_token: string }
    >({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
    }),

    // profile
    getUserDetails: builder.query<GetMyProfileDto, void>({
      query: () => ({ url: "/auth/my-profile", method: "GET" }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: GetMyProfileDto;
      }) => raw.data,
    }),

    updateUserProfile: builder.mutation<
      { id: string; name: string; mobile: string; imageId?: string | null },
      FormData
    >({
      query: (form) => ({
        url: "/auth/my-profile",
        method: "PUT",
        body: form,
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: {
          id: string;
          name: string;
          mobile: string;
          imageId?: string | null;
        };
      }) => raw.data,
    }),

    /* ======================= BUSINESS MGMT ======================= */
    // Business types/categories → arrays (super-admin scope)
    listBusinessTypes: builder.query<BusinessTypeResponseDto[], void>({
      query: () => ({
        url: "/super-admin/seller/business-types/list",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: { data: BusinessTypeResponseDto[]; total: number };
      }) => raw.data.data,
    }),

    listBusinessCategories: builder.query<BusinessCategoryResponseDto[], void>({
      query: () => ({
        url: "/super-admin/business-categories/list",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: { data: BusinessCategoryResponseDto[]; total: number };
      }) => raw.data.data,
    }),

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
        if (!raw.data) throw new Error("Category already exists");
        return raw.data;
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

    /* ======================= DOMAINS ======================= */
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

    getMyDomain: builder.query<DomainWithSSLResponseDto, void>({
      query: () => ({ url: "/seller/business/domains/me", method: "GET" }),
      transformResponse: (raw: {
        message: string;
        data: DomainWithSSLResponseDto;
      }) => raw.data,
    }),

    /* ======================= FILES ======================= */
    uploadImage: builder.mutation<UploadedFileResponse[], UploadImagePayload>({
      query: ({ formData }) => ({
        url: "/files",
        method: "POST",
        body: formData,
      }),
    }),

    /* ───────── POST /seller/business/stores/update ───── */
    updateStore: builder.mutation<StoreResponse, UpdateStorePayload>({
      query: (body) => ({
        url: "/seller/business/stores/update",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: StoreResponse;
      }) => raw.data,
    }),

    /* ───────── GET /seller/business/stores/me ───────── */
    getMyStore: builder.query<StoreResponse, void>({
      query: () => ({
        url: "/seller/business/stores/me",
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: StoreResponse;
      }) => raw.data,
    }),
  }),
});

export const {
  // auth
  useLoginMutation,
  useRegisterMutation,
  useConfirmOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useGetUserDetailsQuery,
  useUpdateUserProfileMutation,

  // business mgmt
  useListBusinessTypesQuery,
  useListBusinessCategoriesQuery,
  useCreateOrUpdateBusinessCategoryMutation,
  useCreateOrUpdateBusinessDetailsMutation,

  // domains
  useListDomainsQuery,
  useLazyListDomainsQuery,
  useCreateOrUpdateDomainMutation,
  useGetMyDomainQuery,

  useGetMyStoreQuery,
  useUpdateStoreMutation,
  // files
  useUploadImageMutation,
} = sellerApi;
