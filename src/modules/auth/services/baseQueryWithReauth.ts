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

// ───────────────── bases ─────────────────
const withAuthHeaders = (headers: Headers, getState: () => unknown) => {
  const token = (getState() as RootState).auth.token;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

const authBase = fetchBaseQuery({
  baseUrl: `${API_ROOT}/auth`,
  credentials: "include",
  prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
});

const rootBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include",
  prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
});

// ───────────────── routing ─────────────────
// Everything under /customer/** should go to ROOT,
// except the explicit CUSTOMER AUTH endpoints.
const isCustomerAuth = (url: string) => url.startsWith("/customer/auth");

const isCustomerNonAuth = (url: string) =>
  url.startsWith("/customer/") && !isCustomerAuth(url);

// Other modules that must NOT be prefixed with /auth.
const isRootEndpoint = (url: string) =>
  isCustomerNonAuth(url) ||
  url.startsWith("/super-admin/") ||
  url.startsWith("/seller/business") ||
  url.startsWith("/seller/product") ||
  url.startsWith("/files");

// endpoints to skip refresh attempts
const shouldSkipRefresh = (url: string) => {
  const path = url.split("?")[0];
  const skip = new Set<string>([
    // SELLER auth
    "/login",
    "/register",

    // CUSTOMER auth (OTP flow)
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

// ───────────────── wrapper with refresh ─────────────────
export const baseQueryWithReauth: typeof authBase = async (
  args,
  api,
  extraOptions
) => {
  const url = typeof args === "string" ? args : args.url;

  // Route to ROOT (no /auth prefix) when appropriate
  if (isRootEndpoint(url)) {
    return rootBase(args as FetchArgs, api, extraOptions);
  }

  // Otherwise use /auth-prefixed base
  let result = await authBase(args, api, extraOptions);

  // If unauthorized, try refresh unless excluded
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
