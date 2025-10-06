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

// ➊ “Auth” base (prefixes `/auth`, adds headers)
const authBase = fetchBaseQuery({
  baseUrl: `${API_ROOT}/auth`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ➋ “Root” base (no `/auth` prefix, still adds headers)
const rootBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ➌ Use rootBase for these paths (no `/auth` prefix)
const isRootEndpoint = (url: string) =>
  url.startsWith("/super-admin/") ||
  url.startsWith("/seller/business") ||
  url.startsWith("/seller/product") ||
  url.startsWith("/files") ||
  url.startsWith("/customer/auth"); // ✅ match your Nest controller @Controller("customer/auth")

// Helper: endpoints to skip refresh attempts (bootstrap flows)
const shouldSkipRefresh = (url: string) => {
  const path = url.split("?")[0];
  const skipList = new Set<string>([
    // seller
    "/login",
    "/register",
    // customer OTP-first
    "/customer/auth/login-init",
    "/customer/auth/register",
    "/customer/auth/confirm-mobile-otp",
    "/customer/auth/resend-mobile-otp",
    "/customer/auth/logout",

    // refresh itself
    "/refresh-auth-token",
  ]);
  return skipList.has(path);
};

// ➍ Wrapper with refresh
export const baseQueryWithReauth: typeof authBase = async (
  args,
  api,
  extraOptions
) => {
  const url = typeof args === "string" ? args : args.url;

  // 1) Routes under API root (no `/auth` prefix)
  if (isRootEndpoint(url)) {
    return rootBase(args as FetchArgs, api, extraOptions);
  }

  // 2) `/auth` prefixed routes + refresh logic
  let result = await authBase(args, api, extraOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = result.error as any;
  const statusCode: number | undefined = err?.data?.statusCode;

  const requestUrl = typeof args === "string" ? args : args.url;
  const skipRefresh = shouldSkipRefresh(requestUrl);

  if (result.error && statusCode === 401 && !skipRefresh) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alreadyRetried = (extraOptions as any)?.__isRetryAttempt;
    if (alreadyRetried) {
      api.dispatch(logout());
      return result;
    }

    // try refresh
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
