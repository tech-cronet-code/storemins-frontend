// customerApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customerBaseQueryWithReauth } from "../../auth/services/customerBaseQueryWithReauth";
import { UserRoleName } from "../../auth/types/profileTypes";

/* ---------- Shared auth DTOs ---------- */
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

interface ConfirmMobileOtpPayload {
  mobile: string;
  confirm_mobile_otp_code: string;
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

interface ResendMobileOtpPayload {
  mobile: string;
  userId?: string;
}
interface ResendMobileOtpResponse {
  message: string;
  expiresAt: string;
}

/* ---------------- Addresses ---------------- */
export type AddressKind = "home" | "work" | "other";
export type CustomerAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  kind: AddressKind;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
};
export type CreateAddressDto = Omit<
  CustomerAddress,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateAddressDto = Partial<CreateAddressDto> & { id: string };

export const customerApi = createApi({
  baseQuery: customerBaseQueryWithReauth,
  reducerPath: "customerApi",
  tagTypes: ["CustomerAddress", "Cart", "CartItem", "Order", "Coupon"] as const,
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

    // 2) register → sends OTP
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

    /* ======================= ADDRESSES ======================= */
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => ({ url: "/customer/addresses/list", method: "GET" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (raw: any) => raw.data,
      providesTags: (res) =>
        res
          ? ([
              ...res.map((a) => ({
                type: "CustomerAddress" as const,
                id: a.id,
              })),
              { type: "CustomerAddress" as const, id: "LIST" },
            ] as const)
          : ([{ type: "CustomerAddress" as const, id: "LIST" }] as const),
    }),

    createCustomerAddress: builder.mutation<CustomerAddress, CreateAddressDto>({
      query: (body) => ({ url: "/customer/addresses", method: "POST", body }),
      invalidatesTags: [{ type: "CustomerAddress" as const, id: "LIST" }],
    }),

    updateCustomerAddress: builder.mutation<CustomerAddress, UpdateAddressDto>({
      query: ({ id, ...body }) => ({
        url: `/customer/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "CustomerAddress" as const, id },
        { type: "CustomerAddress" as const, id: "LIST" },
      ],
    }),

    deleteCustomerAddress: builder.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/customer/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "CustomerAddress" as const, id },
        { type: "CustomerAddress" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  // AUTH
  useCustomerLoginInitMutation,
  useCustomerRegisterMutation,
  useCustomerConfirmOtpMutation,
  useCustomerResendOtpMutation,
  useCustomerLogoutMutation,

  // ADDRESSES
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
} = customerApi;
