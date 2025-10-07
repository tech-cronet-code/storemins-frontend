// src/modules/auth/services/baseQueryWithReauth.ts
import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../../common/state/store";
import { loginSuccess, logout } from "../slices/authSlice";
import { UserRoleName } from "../constants/userRoles";
import { castToUserRoles } from "../../../common/utils/common";

const isDev = import.meta.env.VITE_MODE === "development";

const API_ROOT = isDev
  ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL
  : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE;

export const IMAGE_URL = isDev
  ? import.meta.env.VITE_PUBLIC_IMAGE_URL_LOCAL
  : import.meta.env.VITE_PUBLIC_IMAGE_URL_LIVE;

/* ───────────────── helpers ───────────────── */
const withAuthHeaders = (headers: Headers, getState: () => unknown) => {
  const token = (getState() as RootState).auth.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

/** Base that hits `${API_ROOT}/auth` (seller/admin auth endpoints live here) */
const authBase = fetchBaseQuery({
  baseUrl: `${API_ROOT}/auth`,
  credentials: "include",
  prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
});

/** Base that hits `${API_ROOT}` without the `/auth` prefix */
const rootBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include",
  prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
});

/* ───────────────── routing rules ─────────────────
   RULES:
   - Everything under /customer/** (including /customer/auth/**) → ROOT (NO /auth).
   - Seller/business/product, super-admin, and files also go to ROOT.
   - Only seller/admin auth like /login, /register, /refresh-auth-token stay on /auth.
*/
const routeViaRoot = (url: string) =>
  url.startsWith("/customer/") || // NOTE: covers /customer/auth/** as well
  url.startsWith("/super-admin/") ||
  url.startsWith("/seller/business") ||
  url.startsWith("/seller/product") ||
  url.startsWith("/files");

/** Endpoints where we should NOT attempt a refresh */
const shouldSkipRefresh = (url: string) => {
  const path = url.split("?")[0];
  const skip = new Set<string>([
    // SELLER/ADMIN auth (lives under /auth)
    "/login",
    "/register",

    // CUSTOMER auth (lives under ROOT, but we still don't want to refresh)
    "/customer/auth/login-init",
    "/customer/auth/register",
    "/customer/auth/confirm-mobile-otp",
    "/customer/auth/resend-mobile-otp",
    "/customer/auth/logout",

    // refresh itself
    "/refresh-auth-token",
  ]);
  return skip.has(path);
};

/* ───────────────── main wrapper with refresh ───────────────── */
export const baseQueryWithReauth: typeof authBase = async (
  args,
  api,
  extraOptions
) => {
  const url = typeof args === "string" ? args : args.url;

  // 1) Decide which base to use
  if (routeViaRoot(url)) {
    // -> Goes to ROOT (no /auth prefix). This fixes /customer/auth/** endpoints.
    return rootBase(args as FetchArgs, api, extraOptions);
  }

  // 2) Default: use /auth-prefixed base
  let result = await authBase(args, api, extraOptions);

  // 3) On 401, try refresh (unless excluded)
  const err: any = result.error;
  const statusCode: number | undefined = err?.data?.statusCode;
  const requestUrl = typeof args === "string" ? args : args.url;
  const skipRefresh = shouldSkipRefresh(requestUrl);

  if (result.error && statusCode === 401 && !skipRefresh) {
    const alreadyRetried = (extraOptions as any)?.__isRetryAttempt;
    if (alreadyRetried) {
      api.dispatch(logout());
      return result;
    }

    const refreshRes = await authBase(
      { url: "/refresh-auth-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshRes.data) {
      const data = refreshRes.data as {
        access_token: string;
        refresh_token: string;
        id: string;
        name?: string;
        mobile: string;
        role: UserRoleName[] | string[];
        permissions: string[];
        mobile_confirmed?: boolean;
      };

      api.dispatch(
        loginSuccess({
          user: {
            id: data.id,
            name: data.name || "",
            mobile: data.mobile,
            role: castToUserRoles(data.role),
            permissions: data.permissions,
            mobile_confirmed: data.mobile_confirmed ?? false,
          },
          token: data.access_token,
          refreshToken: data.refresh_token,
        })
      );

      // retry original once
      result = await authBase(args, api, {
        ...extraOptions,
        __isRetryAttempt: true,
      });
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
