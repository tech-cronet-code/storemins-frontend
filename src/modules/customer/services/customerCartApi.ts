import { storeApi } from "../../auth/services/storeApi";

/* ======================= Types (aligned with BE) ======================= */
export type Currency = "INR" | string;

export type CartProductMini = {
  id: string;
  name: string;
  Media: { url: string }[];
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  currency: Currency;
  Product?: CartProductMini;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
};

export type Cart = {
  id: string;
  status: "ACTIVE" | "CHECKED_OUT" | string;
  currency: Currency;
  expiresAt: string | null;
  items: CartItem[];
  totals: CartTotals;
};

/** #1 Get/Create active cart */
export type GetActiveCartResponse = { cart: Cart };
export type GetActiveCartQuery = { businessId: string };

/** #2 Add item */
export type AddItemBody = {
  productId: string;
  variantId: string | null;
  quantity: number;
};
export type AddItemResponse = {
  cartId: string;
  item: CartItem;
  totals: CartTotals;
};

/** #3 Update item */
export type UpdateItemBody = {
  quantity?: number; // set 0 to remove
  variantId?: string | null;
};
export type UpdateItemParams = { itemId: string; businessId: string };
export type UpdateItemResponse = { id: string; quantity: number };

/** #4 Remove item */
export type RemoveItemParams = { itemId: string; businessId: string };
export type RemoveItemResponse = { cartId: string; removedId: string };

/** #5 Clear cart */
export type ClearCartQuery = { businessId: string };
export type ClearCartResponse = { cartId: string; cleared: true };

/** #6 Move item → Saved for later */
export type MoveToSflParams = { itemId: string; businessId: string };
export type MoveToSflResponse = {
  movedTo: "SavedForLater";
  savedItem: { id: string; productId: string; variantId: string | null };
};

/** #7 Move SFL → cart */
export type MoveSflToCartParams = { savedId: string; businessId: string };
export type MoveSflToCartBody = { quantity?: number };
export type MoveSflToCartResponse = { cartItemId: string; quantity: number };

/** #8 Apply coupon */
export type ApplyCouponParams = { cartId: string; businessId: string };
export type ApplyCouponBody = { code: string };
export type ApplyCouponResponse = {
  ok: boolean;
  coupon: {
    id: string;
    code: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Configuration: Record<string, any> | null;
  } | null;
  totals: CartTotals;
};

/** #9 Merge guest cart → user cart */
export type MergeCartBody =
  | { guestCartId: string }
  | { guestSessionId: string };
export type MergeCartQuery = { businessId: string };
export type MergeCartResponse = {
  newCartId: string | null;
  mergedFrom: string | null;
  logId: string;
};

/** #10 Summary */
export type CartSummaryParams = { cartId: string; businessId: string };
export type CartSummaryResponse = {
  items: { id: string; productId: string; quantity: number; price: number }[];
  coupons: { code: string; value: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
};

/** #11 Draft (checkout draft) */
export type UpsertDraftParams = { cartId: string; businessId: string };
export type UpsertDraftBody = {
  shippingAddressId?: string;
  billingAddressId?: string;
  guestAddress?: {
    fullName: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
    email?: string;
  } | null;
};
export type UpsertDraftResponse = {
  draft: {
    id: string;
    cartId: string;
    userId: string | null;
    tenantId: string;
    businessId: string;
    expiresAt: string | null;
    isConverted: boolean;
  };
  totals: CartTotals;
};

/** #12 Abandon cart */
export type AbandonCartParams = { cartId: string; businessId: string };
export type AbandonCartResponse = { abandoned: true; abandonedAt: string };

/* ======================= API ======================= */
export const customerCartApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    // #1
    getActiveCart: builder.query<Cart, GetActiveCartQuery>({
      query: ({ businessId }) => ({
        url: `/customer/cart/active`,
        method: "GET",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: GetActiveCartResponse;
      }) => raw.data.cart,
      providesTags: (cart) =>
        cart
          ? ([
              { type: "Cart" as const, id: cart.id },
              ...cart.items.map((i) => ({
                type: "CartItem" as const,
                id: i.id,
              })),
              { type: "CartItem" as const, id: "LIST" },
            ] as const)
          : ([{ type: "CartItem" as const, id: "LIST" }] as const),
    }),

    // #2 (businessId in params AND body)
    addItemToCart: builder.mutation<
      AddItemResponse,
      GetActiveCartQuery & AddItemBody
    >({
      query: ({ businessId, ...body }) => ({
        url: `/customer/cart/item`,
        method: "POST",
        params: { businessId },
        body: { ...body, businessId }, // ← per your ask
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: AddItemResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #3
    updateCartItem: builder.mutation<
      UpdateItemResponse,
      UpdateItemParams & UpdateItemBody
    >({
      query: ({ itemId, businessId, ...body }) => ({
        url: `/customer/cart/item/${itemId}`,
        method: "POST",
        params: { businessId },
        body: { ...body, businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: UpdateItemResponse;
      }) => raw.data,
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "CartItem" as const, id: itemId },
        { type: "CartItem" as const, id: "LIST" },
      ],
    }),

    // #4
    removeCartItem: builder.mutation<RemoveItemResponse, RemoveItemParams>({
      query: ({ itemId, businessId }) => ({
        url: `/customer/cart/item/${itemId}`,
        method: "DELETE",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: RemoveItemResponse;
      }) => raw.data,
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "CartItem" as const, id: itemId },
        { type: "CartItem" as const, id: "LIST" },
      ],
    }),

    // #5
    clearCart: builder.mutation<ClearCartResponse, ClearCartQuery>({
      query: ({ businessId }) => ({
        url: `/customer/cart/clear`,
        method: "DELETE",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: ClearCartResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #6
    moveItemToSfl: builder.mutation<MoveToSflResponse, MoveToSflParams>({
      query: ({ itemId, businessId }) => ({
        url: `/customer/cart/item/${itemId}/save-for-later`,
        method: "POST",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: MoveToSflResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #7
    moveSflToCart: builder.mutation<
      MoveSflToCartResponse,
      MoveSflToCartParams & MoveSflToCartBody
    >({
      query: ({ savedId, businessId, ...body }) => ({
        url: `/customer/cart/saved-for-later/${savedId}/move-to-cart`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: MoveSflToCartResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #8
    applyCouponOnCart: builder.mutation<
      ApplyCouponResponse,
      ApplyCouponParams & ApplyCouponBody
    >({
      query: ({ cartId, businessId, ...body }) => ({
        url: `/customer/cart/${cartId}/coupon`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: ApplyCouponResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #9
    mergeCart: builder.mutation<
      MergeCartResponse,
      MergeCartQuery & MergeCartBody
    >({
      query: ({ businessId, ...body }) => ({
        url: `/customer/cart/merge`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: MergeCartResponse;
      }) => raw.data,
      invalidatesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #10
    getCartSummary: builder.query<CartSummaryResponse, CartSummaryParams>({
      query: ({ cartId, businessId }) => ({
        url: `/customer/cart/${cartId}/summary`,
        method: "GET",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: CartSummaryResponse;
      }) => raw.data,
      providesTags: [{ type: "CartItem" as const, id: "LIST" }],
    }),

    // #11
    upsertDraftFromCart: builder.mutation<
      UpsertDraftResponse,
      UpsertDraftParams & UpsertDraftBody
    >({
      query: ({ cartId, businessId, ...body }) => ({
        url: `/customer/cart/${cartId}/draft`,
        method: "POST",
        params: { businessId },
        body,
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: UpsertDraftResponse;
      }) => raw.data,
    }),

    // #12
    abandonCart: builder.mutation<AbandonCartResponse, AbandonCartParams>({
      query: ({ cartId, businessId }) => ({
        url: `/customer/cart/${cartId}/abandon`,
        method: "POST",
        params: { businessId },
      }),
      transformResponse: (raw: {
        success: boolean;
        statusCode: number;
        data: AbandonCartResponse;
      }) => raw.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActiveCartQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useMoveItemToSflMutation,
  useMoveSflToCartMutation,
  useApplyCouponOnCartMutation,
  useMergeCartMutation,
  useGetCartSummaryQuery,
  useUpsertDraftFromCartMutation,
  useAbandonCartMutation,
} = customerCartApi;
