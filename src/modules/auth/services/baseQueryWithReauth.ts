// // src/modules/auth/services/baseQueryWithReauth.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../common/state/store";
// import { loginSuccess, logout } from "../slices/authSlice";
// import { UserRoleName } from "../constants/userRoles";
// import { castToUserRoles } from "../../../common/utils/common";

// const isDev = import.meta.env.VITE_MODE === "development";

// const API_ROOT = isDev
//   ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL
//   : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE;

// export const IMAGE_URL = isDev
//   ? import.meta.env.VITE_PUBLIC_IMAGE_URL_LOCAL
//   : import.meta.env.VITE_PUBLIC_IMAGE_URL_LIVE;

// const withAuthHeaders = (headers: Headers, getState: () => unknown) => {
//   const state = getState() as RootState;
//   const token = state.auth.token;
//   if (token) headers.set("Authorization", `Bearer ${token}`);
//   // DO NOT set 'x-business-id' header; use query params instead.
//   return headers;
// };

// /** Base that hits `${API_ROOT}/auth` */
// const authBase = fetchBaseQuery({
//   baseUrl: `${API_ROOT}/auth`,
//   credentials: "omit", // avoid cookies to simplify CORS
//   prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
// });

// /** Base that hits `${API_ROOT}` (no /auth prefix) */
// const rootBase = fetchBaseQuery({
//   baseUrl: API_ROOT,
//   credentials: "omit",
//   prepareHeaders: (h, api) => withAuthHeaders(h, api.getState),
// });

// /* Routing rules:
//    - Everything under /customer/** and other app routes → ROOT (no /auth)
//    - Only seller/admin auth endpoints stay on /auth
// */
// const routeViaRoot = (url: string) =>
//   url.startsWith("/customer/") ||
//   url.startsWith("/super-admin/") ||
//   url.startsWith("/seller/business") ||
//   url.startsWith("/seller/product") ||
//   url.startsWith("/seller/coupons") ||
//   url.startsWith("/seller/orders") ||
//   url.startsWith("/files");

// /** Endpoints where refresh should NOT be attempted */
// const shouldSkipRefresh = (url: string) => {
//   const path = url.split("?")[0];
//   const skip = new Set<string>([
//     "/login",
//     "/register",
//     "/customer/auth/login-init",
//     "/customer/auth/register",
//     "/customer/auth/confirm-mobile-otp",
//     "/customer/auth/resend-mobile-otp",
//     "/customer/auth/logout",
//     "/refresh-auth-token",
//   ]);
//   return skip.has(path);
// };

// type ExtraOptionsWithRetry = Parameters<typeof authBase>[2] & {
//   __isRetryAttempt?: boolean;
// };

// export const baseQueryWithReauth: typeof authBase = async (
//   args,
//   api,
//   extraOptions
// ) => {
//   const url = typeof args === "string" ? args : args.url;
//   const base = routeViaRoot(url) ? rootBase : authBase;

//   // 1) Original request
//   let result = await base(args as FetchArgs, api, extraOptions);

//   // 2) If 401, try refresh then retry once
//   const err = (result as any)?.error as
//     | { status?: number; data?: any }
//     | undefined;

//   const statusFromRtk = err?.status;
//   const statusFromBody = err?.data?.statusCode;
//   const statusCode = (statusFromRtk ?? statusFromBody) as number | undefined;

//   const requestUrl = (typeof args === "string" ? args : args.url).split("?")[0];
//   const skipRefresh = shouldSkipRefresh(requestUrl);

//   if (err && statusCode === 401 && !skipRefresh) {
//     const alreadyRetried = (extraOptions as ExtraOptionsWithRetry)
//       ?.__isRetryAttempt;
//     if (alreadyRetried) {
//       api.dispatch(logout());
//       return result;
//     }

//     // Refresh token request always under /auth
//     const refreshRes = await authBase(
//       { url: "/refresh-auth-token", method: "POST" },
//       api,
//       extraOptions
//     );

//     if ((refreshRes as any).data) {
//       const data = (refreshRes as any).data as {
//         access_token: string;
//         refresh_token: string;
//         id: string;
//         name?: string;
//         mobile: string;
//         role: UserRoleName[] | string[];
//         permissions: string[];
//         mobile_confirmed?: boolean;
//       };

//       api.dispatch(
//         loginSuccess({
//           user: {
//             id: data.id,
//             name: data.name || "",
//             mobile: data.mobile,
//             role: castToUserRoles(data.role),
//             permissions: data.permissions,
//             mobile_confirmed: data.mobile_confirmed ?? false,
//           },
//           token: data.access_token,
//           refreshToken: data.refresh_token,
//         })
//       );

//       // Retry original once
//       result = await base(args as FetchArgs, api, {
//         ...(extraOptions as ExtraOptionsWithRetry),
//         __isRetryAttempt: true,
//       });
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };
