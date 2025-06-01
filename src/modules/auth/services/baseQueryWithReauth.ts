// src/common/services/baseQueryWithReauth.ts

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

// ➋ “Admin” base (no `/auth` prefix, but still adds headers)
const adminBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ➌ Which paths should use the “adminBase” instead of authBase?
const isAdminEndpoint = (url: string) =>
  url.startsWith("/super-admin/") ||
  url.startsWith("/seller/business") ||
  url.startsWith("/seller/product");

// ➍ The wrapper
export const baseQueryWithReauth: typeof authBase = async (
  args,
  api,
  extraOptions
) => {
  const url = typeof args === "string" ? args : args.url;

  // 1️⃣ If it’s an admin endpoint, use adminBase
  if (isAdminEndpoint(url)) {
    return adminBase(args as FetchArgs, api, extraOptions);
  }

  // 2️⃣ Otherwise use authBase + refresh logic
  let result = await authBase(args, api, extraOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = result.error as any;
  const statusCode: number | undefined = err?.data?.statusCode;

  const requestUrl = typeof args === "string" ? args : args.url;
  const skipRefresh = ["/login", "/register"].includes(requestUrl);

  if (result.error && statusCode === 401 && !skipRefresh) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alreadyRetried = (extraOptions as any)?.__isRetryAttempt;
    if (alreadyRetried) {
      api.dispatch(logout());
      return result;
    }

    // attempt token refresh
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
        role: UserRoleName[];
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

      // retry original
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
