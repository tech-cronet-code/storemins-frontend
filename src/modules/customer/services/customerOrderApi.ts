/* eslint-disable @typescript-eslint/no-explicit-any */
import { customerApi } from "./customerApi";

/* ======================= Types ======================= */
export type PayMode =
  | "COD"
  | "UPI"
  | "CARD"
  | "NET_BANKING"
  | "WALLET"
  | "PAY_LATER";
export type PayProvider = "INTERNAL" | "RAZORPAY" | "STRIPE" | string;

export type PlaceOrderBody = {
  draftId: string;
  cartId: string;
  payment: {
    mode: PayMode;
    provider: PayProvider;
    paymentToken?: string | null;
    upiId?: string | null;
  };
  notes?: string | null;
};
export type PlaceOrderQuery = { businessId: string };
export type PlaceOrderResponse = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  placedAt: string;
};

export type MyOrdersStatusFilter = "ONGOING" | "COMPLETED";
export type MyOrdersQuery = {
  businessId: string;
  status?: MyOrdersStatusFilter;
  page?: number;
  limit?: number;
};
export type MyOrdersItem = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  placedAt: string;
  OrderItem: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    Product: { id: string; name: string };
  }[];
  OrderTrackingStatus: { currentStep: string } | null;
};
export type MyOrdersResponse = { items: MyOrdersItem[]; total: number };

export type OrderDetailParams = { businessId: string; orderId: string };
export type OrderDetailResponse = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  totalAmount: number;
  Shipping: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber?: string;
    email?: string;
  } | null;
  OrderItem: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    Product: { id: string; name: string };
  }[];
  Payment: { status: string; method: string; provider: string } | null;
  OrderTrackingStatus: { currentStep: string; nextStep?: string } | null;
};

export type CancelOrderParams = { businessId: string; orderId: string };
export type CancelOrderBody = { reason: string };
export type CancelOrderResponse = { status: "CANCELLED" };

export type ReturnOrderParams = { businessId: string; orderId: string };
export type ReturnOrderBody = {
  itemId: string;
  reason: string;
  preferredResolution: "REFUND" | "REPLACE";
};
export type ReturnOrderResponse = { returnRequestId: string; status: string };

export type TrackOrderParams = { businessId: string; orderId: string };
export type TrackOrderResponse = {
  currentStep: string;
  nextStep?: string;
  updatedAt: string;
  logs: { status: string; message: string; updatedAt: string }[];
};

export type RetryPaymentParams = { businessId: string; orderId: string };
export type RetryPaymentBody = {
  mode: PayMode;
  provider: PayProvider;
  paymentToken: string;
  upiId?: string;
};
export type RetryPaymentResponse = {
  payment: {
    status: "PENDING" | "SUCCESS" | "FAILED" | string;
    provider: string;
  };
};

export type InvoiceParams = { businessId: string; orderId: string };
export type InvoiceResponse = {
  invoiceNumber: string;
  status: string;
  pdfUrl: string;
};

/* ======================= API ======================= */
export const customerOrderApi = customerApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<
      PlaceOrderResponse,
      PlaceOrderQuery & PlaceOrderBody
    >({
      query: ({ businessId, ...body }) => ({
        url: `/customer/orders/place`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: PlaceOrderResponse;
      }) => raw?.data,
      invalidatesTags: [{ type: "Order" as const, id: "LIST" }],
    }),
    getMyOrders: builder.query<MyOrdersResponse, MyOrdersQuery>({
      query: ({ businessId, status, page = 1, limit = 50 }) => ({
        url: `/customer/orders/my`,
        method: "GET",
        params: { businessId, status, page, limit },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: MyOrdersResponse;
      }) => raw?.data,
      providesTags: (res) =>
        res
          ? ([
              ...res.items.map((o) => ({ type: "Order" as const, id: o.id })),
              { type: "Order" as const, id: "LIST" },
            ] as const)
          : ([{ type: "Order" as const, id: "LIST" }] as const),
    }),
    getOrderDetail: builder.query<OrderDetailResponse, OrderDetailParams>({
      query: ({ businessId, orderId }) => ({
        url: `/customer/orders/${orderId}`,
        method: "GET",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: OrderDetailResponse;
      }) => raw?.data,
      providesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
    cancelOrder: builder.mutation<
      CancelOrderResponse,
      CancelOrderParams & CancelOrderBody
    >({
      query: ({ businessId, orderId, ...body }) => ({
        url: `/customer/orders/${orderId}/cancel`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: CancelOrderResponse;
      }) => raw?.data,
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
    requestReturn: builder.mutation<
      ReturnOrderResponse,
      ReturnOrderParams & ReturnOrderBody
    >({
      query: ({ businessId, orderId, ...body }) => ({
        url: `/customer/orders/${orderId}/return`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: ReturnOrderResponse;
      }) => raw?.data,
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
    trackOrder: builder.query<TrackOrderResponse, TrackOrderParams>({
      query: ({ businessId, orderId }) => ({
        url: `/customer/orders/${orderId}/tracking`,
        method: "GET",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: TrackOrderResponse;
      }) => raw?.data,
      providesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
    retryPayment: builder.mutation<
      RetryPaymentResponse,
      RetryPaymentParams & RetryPaymentBody
    >({
      query: ({ businessId, orderId, ...body }) => ({
        url: `/customer/orders/${orderId}/payment/retry`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: RetryPaymentResponse;
      }) => raw?.data,
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
    getInvoice: builder.query<InvoiceResponse, InvoiceParams>({
      query: ({ businessId, orderId }) => ({
        url: `/customer/orders/${orderId}/invoice`,
        method: "GET",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: InvoiceResponse;
      }) => raw?.data,
      providesTags: (_r, _e, { orderId }) => [
        { type: "Order" as const, id: orderId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
  useCancelOrderMutation,
  useRequestReturnMutation,
  useTrackOrderQuery,
  useRetryPaymentMutation,
  useGetInvoiceQuery,
} = customerOrderApi;
