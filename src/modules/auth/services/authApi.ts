//  apiClient.ts for REGISTER

import { createApi } from "@reduxjs/toolkit/query/react";
import {
  StoreResponse,
  UpdateStorePayload,
} from "../../seller/types/storeTypes";
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
import {
  UploadedFileResponse,
  UploadImagePayload,
} from "../types/imageUploadTypes";

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

/* ---------------- Customer types ---------------- */
export interface CustomerLoginInitPayload {
  mobile: string;
}
export interface CustomerLoginInitResult {
  id: string; // empty string if not found
  needs_confirm_otp_code: boolean;
  otpExpiresAt: string | null;
  message?: string;
}

export interface CustomerRegisterPayload {
  name: string;
  mobile: string;
  isTermAndPrivarcyEnable: boolean;
  email?: string;
}
export interface CustomerRegisterResult {
  id: string;
  needs_confirm_otp_code: boolean;
  otpExpiresAt: string | null;
  message?: string;
}

// Add these imports at top
interface ConfirmMobileOtpPayload {
  mobile: string;
  confirm_mobile_otp_code: string;
}

// interface ConfirmMobileOtpResponse {
//   id: string;
//   mobile: string;
//   mobile_confirmed: boolean;
//   message?: string;
// }

interface ConfirmMobileOtpResponse {
  // your BE returns JwtResponseDto here (tokens + user)
  id: string;
  name?: string;
  mobile: string;
  role?: string[]; // keep lenient
  permissions?: string[];
  access_token: string;
  refresh_token?: string | null; // cookie in BE, may be stripped from body
  tenentId?: string | null;
  mobile_confirmed?: boolean;
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
// interface UpdateProfileRequestDto {
//   name: string;
// }

export interface JwtResponseDto {
  id: string;
  name?: string;
  mobile: string;
  role?: UserRoleName[] | string[]; // normalized later
  permissions?: string[];
  access_token: string;
  refresh_token?: string | null; // optional (cookie on BE)
  tenentId?: string | null;
  mobile_confirmed?: boolean;
}

interface UpdateProfileResponseDto {
  id: string;
  name: string;
  mobile: string;
  imageId?: string | null; // "<fileId>.webp"
}

export const apiClient = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "apiClient",
  endpoints: (builder) => ({
    /* ======================= CUSTOMER AUTH ======================= */

    // 1) login-init (mobile only) — always drive OTP flow
    customerLoginInit: builder.mutation<
      CustomerLoginInitResult,
      CustomerLoginInitPayload
    >({
      query: (body) => ({
        url: "/customer/auth/login-init",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: CustomerLoginInitResult;
      }) => ({
        ...raw.data,
        message: raw.message ?? raw.data?.message,
      }),
    }),

    // 2) register (name + mobile [+ email?]) → sends OTP
    customerRegister: builder.mutation<
      CustomerRegisterResult,
      CustomerRegisterPayload
    >({
      query: (body) => ({
        url: "/customer/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: CustomerRegisterResult;
      }) => ({
        ...raw.data,
        message: raw.message ?? raw.data?.message,
      }),
    }),

    // 3) confirm-mobile-otp → issues tokens (access in body, refresh via cookie)
    customerConfirmOtp: builder.mutation<
      JwtResponseDto,
      ConfirmMobileOtpPayload
    >({
      query: (body) => ({
        url: "/customer/auth/confirm-mobile-otp",
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

    // 4) resend-mobile-otp
    customerResendOtp: builder.mutation<
      ResendMobileOtpResponse,
      ResendMobileOtpPayload
    >({
      query: (body) => ({
        url: "/customer/auth/resend-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: ResendMobileOtpResponse;
      }) => raw.data,
    }),

    // 5) logout
    customerLogout: builder.mutation<
      { message: string; statusCode: number },
      { access_token: string }
    >({
      query: (body) => ({
        url: "/customer/auth/logout",
        method: "POST",
        body,
      }),
    }),

    /* ======================= SELLER AUTH (existing) ======================= */

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
    updateUserProfile: builder.mutation<UpdateProfileResponseDto, FormData>({
      query: (form) => ({
        url: "/my-profile",
        method: "PUT",
        body: form, // ⬅️ FormData, DON'T set Content-Type manually
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: UpdateProfileResponseDto;
      }) => raw.data, // ⬅️ unwrap
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

    // Image Upload
    uploadImage: builder.mutation<UploadedFileResponse[], UploadImagePayload>({
      query: ({ formData }) => ({
        url: "/files",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

/* ---------------- hooks ---------------- */
export const {
  // customer
  useCustomerLoginInitMutation,
  useCustomerRegisterMutation,
  useCustomerConfirmOtpMutation,
  useCustomerResendOtpMutation,
  useCustomerLogoutMutation,

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
  useUploadImageMutation,
} = apiClient;
