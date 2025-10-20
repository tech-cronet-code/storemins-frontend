import { createApi } from "@reduxjs/toolkit/query/react";
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
import { sellerBaseQueryWithReauth } from "./sellerBaseQueryWithReauth";

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

export const sellerApi = createApi({
  baseQuery: sellerBaseQueryWithReauth,
  reducerPath: "sellerApi",
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({ url: "/register", method: "POST", body }),
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
    getUserDetails: builder.query<GetMyProfileDto, void>({
      query: () => ({ url: "/my-profile", method: "GET" }),
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
      query: (form) => ({ url: "/my-profile", method: "PUT", body: form }),
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

    // Business types/categories → arrays
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

    getMyStore: builder.query<any, void>({
      query: () => ({ url: "/seller/business/stores/me", method: "GET" }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: any;
      }) => raw.data,
    }),
    updateStore: builder.mutation<any, any>({
      query: (body) => ({
        url: "/seller/business/stores/update",
        method: "POST",
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        message: string;
        statusCode: number;
        data: any;
      }) => raw.data,
    }),
    getMyDomain: builder.query<DomainWithSSLResponseDto, void>({
      query: () => ({ url: "/seller/business/domains/me", method: "GET" }),
      transformResponse: (raw: {
        message: string;
        data: DomainWithSSLResponseDto;
      }) => raw.data,
    }),
    uploadImage: builder.mutation<UploadedFileResponse[], UploadImagePayload>({
      query: ({ formData }) => ({
        url: "/files",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
  useUpdateUserProfileMutation,
  useListBusinessTypesQuery,
  useListBusinessCategoriesQuery,
  useCreateOrUpdateBusinessCategoryMutation,
  useCreateOrUpdateBusinessDetailsMutation,
  useGetMyStoreQuery,
  useUpdateStoreMutation,
  useGetMyDomainQuery,
  useListDomainsQuery,
  useLazyListDomainsQuery,
  useCreateOrUpdateDomainMutation,
  useUploadImageMutation,
} = sellerApi;
