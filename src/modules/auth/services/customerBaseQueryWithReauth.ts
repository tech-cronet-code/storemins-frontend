/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../../common/state/store";
import { loginSuccess, logout } from "../slices/customerAuthSlice";

const API_ROOT =
  (import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL
    : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE) || "";

/* ---------- Helper to resolve businessId ---------- */
function resolveBusinessId(): string | null {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="business-id"]'
  );
  if (meta?.content?.trim()) return meta.content.trim();

  const ds =
    document.body?.getAttribute("data-business-id") ||
    document.documentElement?.getAttribute("data-business-id");
  if (ds && ds.trim()) return ds.trim();

  const keys = [
    "businessId",
    "storeBusinessId",
    "shopBusinessId",
    "current_business_id",
  ];
  for (const k of keys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v && v.trim()) return v.trim();
  }
  return null;
}

const rootBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include", // include customer_refresh_token__${businessId}
  prepareHeaders: (h, api) => {
    const state = api.getState() as RootState;
    const token = state.customerAuth.token;
    if (token) h.set("Authorization", `Bearer ${token}`);
    const biz = resolveBusinessId();
    if (biz) h.set("x-business-id", biz);
    return h;
  },
});

const shouldSkip = (url: string) => {
  const path = (typeof url === "string" ? url : (url as any).url).split("?")[0];
  return new Set([
    "/customer/auth/login-init",
    "/customer/auth/register",
    "/customer/auth/confirm-mobile-otp",
    "/customer/auth/resend-mobile-otp",
    "/customer/auth/logout",
    "/customer/auth/refresh-auth-token", // ✅ updated endpoint
  ]).has(path);
};

export const customerBaseQueryWithReauth: typeof rootBase = async (
  args,
  api,
  extra
) => {
  let res = await rootBase(args as FetchArgs, api, extra);
  const err = (res as any)?.error;
  const status = err?.status ?? err?.data?.statusCode;

  if (
    status === 401 &&
    !shouldSkip(typeof args === "string" ? args : (args as FetchArgs).url!)
  ) {
    const refresh = await rootBase(
      { url: "/customer/auth/refresh-auth-token", method: "POST" },
      api,
      extra
    );
    const data = (refresh as any)?.data;
    if (data?.data?.access_token) {
      api.dispatch(
        loginSuccess({
          user: (api.getState() as RootState).customerAuth.user!,
          token: data.data.access_token,
          refreshToken: data.data.refresh_token ?? null,
        })
      );
      res = await rootBase(args as FetchArgs, api, extra);
    } else {
      api.dispatch(logout());
    }
  }
  return res;
};
