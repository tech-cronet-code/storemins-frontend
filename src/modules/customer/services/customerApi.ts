import { createApi } from "@reduxjs/toolkit/query/react";
import { customerBaseQueryWithReauth } from "../../auth/services/customerBaseQueryWithReauth";
import { UserRoleName } from "../../auth/types/profileTypes";

/* ---------- Shared auth DTOs ---------- */
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

export interface ConfirmMobileOtpPayload {
  mobile: string;
  confirm_mobile_otp_code: string;
  businessId: string;
}

/* ---------------- Customer types ---------------- */
export interface CustomerLoginInitPayload {
  mobile: string;
  businessId: string;
}
export interface CustomerLoginInitResult {
  id: string;
  needs_confirm_otp_code: boolean;
  otpExpiresAt: string | null;
  message?: string;
}

export interface CustomerRegisterPayload {
  customerName: string;
  mobile: string;
  isTermAndPrivarcyEnable: boolean;
  email?: string;
  businessId: string;
}
export interface CustomerRegisterResult {
  id: string;
  needs_confirm_otp_code: boolean;
  otpExpiresAt: string | null;
  message?: string;
}

/* ---------------- My Profile (Customer) ---------------- */
export interface GetMyProfileDto {
  id: string;
  name: string;
  customerName: string;
  mobile: string;
  image?: string;
  role: string[];
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
    customerLoginInit: builder.mutation<
      CustomerLoginInitResult,
      CustomerLoginInitPayload
    >({
      query: (body) => ({
        url: "/customer/auth/login-init",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        ...raw?.data,
        message: raw?.message ?? raw?.data?.message,
      }),
    }),
    customerRegister: builder.mutation<
      CustomerRegisterResult,
      CustomerRegisterPayload
    >({
      query: (body) => ({
        url: "/customer/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        ...raw?.data,
        message: raw?.message ?? raw?.data?.message,
      }),
    }),
    customerConfirmOtp: builder.mutation<
      JwtResponseDto,
      ConfirmMobileOtpPayload
    >({
      query: (body) => ({
        url: "/customer/auth/confirm-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw?.data,
    }),
    customerResendOtp: builder.mutation<
      { message: string; expiresAt: string },
      { mobile: string; userId?: string }
    >({
      query: (body) => ({
        url: "/customer/auth/resend-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw?.data,
    }),
    customerLogout: builder.mutation<
      { message: string; statusCode: number },
      { access_token: string }
    >({
      query: (body) => ({ url: "/customer/auth/logout", method: "POST", body }),
    }),
    getMyProfile: builder.query<GetMyProfileDto, void>({
      query: () => ({ url: "/customer/auth/my-profile", method: "GET" }),
      transformResponse: (raw: any) => raw?.data as GetMyProfileDto,
    }),

    /* ======================= ADDRESSES ======================= */
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => ({ url: "/customer/addresses/list", method: "GET" }),
      transformResponse: (raw: any) => raw?.data ?? [],
      providesTags: (res) =>
        res
          ? [
              ...res.map((a) => ({
                type: "CustomerAddress" as const,
                id: a.id,
              })),
              { type: "CustomerAddress" as const, id: "LIST" },
            ]
          : [{ type: "CustomerAddress" as const, id: "LIST" }],
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
  useCustomerLoginInitMutation,
  useCustomerRegisterMutation,
  useCustomerConfirmOtpMutation,
  useCustomerResendOtpMutation,
  useCustomerLogoutMutation,
  useGetMyProfileQuery,
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
} = customerApi;
