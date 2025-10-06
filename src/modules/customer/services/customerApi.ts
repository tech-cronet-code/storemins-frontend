import { apiClient } from "../../auth/services/authApi";

/* =================== Types aligned with BE =================== */
export type AddressKind = "home" | "work" | "other";

export type CustomerAddress = {
  id: string;
  label: string; // e.g. "Home"
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  kind: AddressKind; // 👈 FE expects this, BE provides via mapOut
  isDefault?: boolean;
  createdAt: string; // ISO string from BE
  updatedAt?: string; // ISO string from BE
};

export type CreateAddressDto = Omit<
  CustomerAddress,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateAddressDto = Partial<CreateAddressDto> & { id: string };

/* =================== RTK Query =================== */
export const customerApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerAddresses: builder.query<CustomerAddress[], void>({
      query: () => ({
        url: "/customer/addresses/list", // ✅ no /auth prefix
        method: "GET",
      }),
      transformResponse: (raw: {
        success: boolean;
        message?: string;
        statusCode: number;
        data: CustomerAddress[];
      }) => raw.data,
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
      query: (body) => ({
        url: "/customer/addresses", // ✅ no /auth prefix
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CustomerAddress", id: "LIST" }],
    }),

    updateCustomerAddress: builder.mutation<CustomerAddress, UpdateAddressDto>({
      query: ({ id, ...body }) => ({
        url: `/customer/addresses/${id}`, // ✅ no /auth prefix
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "CustomerAddress", id: arg.id },
        { type: "CustomerAddress", id: "LIST" },
      ],
    }),

    deleteCustomerAddress: builder.mutation<{ success: true }, string>({
      query: (id) => ({
        url: `/customer/addresses/${id}`, // ✅ no /auth prefix
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "CustomerAddress", id },
        { type: "CustomerAddress", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomerAddressesQuery,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
} = customerApi;
