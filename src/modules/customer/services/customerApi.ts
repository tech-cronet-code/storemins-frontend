import { createApi } from "@reduxjs/toolkit/query/react";
import { customerBaseQueryWithReauth } from "../../auth/services/customerBaseQueryWithReauth";

/* Types... (reuse your existing) */
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
    // AUTH (customer)
    customerLoginInit: builder.mutation<any, { mobile: string }>({
      query: (body) => ({
        url: "/customer/auth/login-init",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw.data,
    }),
    customerRegister: builder.mutation<
      any,
      {
        name: string;
        mobile: string;
        isTermAndPrivarcyEnable: boolean;
        email?: string;
      }
    >({
      query: (body) => ({
        url: "/customer/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw.data,
    }),
    customerConfirmOtp: builder.mutation<
      any,
      { mobile: string; confirm_mobile_otp_code: string }
    >({
      query: (body) => ({
        url: "/customer/auth/confirm-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw.data,
    }),
    customerResendOtp: builder.mutation<
      any,
      { mobile: string; userId?: string }
    >({
      query: (body) => ({
        url: "/customer/auth/resend-mobile-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => raw.data,
    }),
    customerLogout: builder.mutation<
      { message: string; statusCode: number },
      { access_token: string }
    >({
      query: (body) => ({ url: "/customer/auth/logout", method: "POST", body }),
    }),

    // ADDRESSES
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => ({ url: "/customer/addresses/list", method: "GET" }),
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
  useCustomerLoginInitMutation,
  useCustomerRegisterMutation,
  useCustomerConfirmOtpMutation,
  useCustomerResendOtpMutation,
  useCustomerLogoutMutation,
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
} = customerApi;
