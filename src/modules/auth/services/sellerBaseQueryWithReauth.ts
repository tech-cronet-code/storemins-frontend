/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../../common/state/store";
import { loginSuccess, logout } from "../slices/sellerAuthSlice";

const API_ROOT =
  (import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LOCAL
    : import.meta.env.VITE_PUBLIC_API_URL_RUNTIME_LIVE) || "";

const authBase = fetchBaseQuery({
  baseUrl: `${API_ROOT}/auth`,
  credentials: "include", // send seller_refresh_token cookie
  prepareHeaders: (h, api) => {
    const state = api.getState() as RootState;
    const token = state.sellerAuth.token;
    if (token) h.set("Authorization", `Bearer ${token}`);
    return h;
  },
});

const shouldSkip = (url: string) => {
  const path = (typeof url === "string" ? url : (url as any).url).split("?")[0];
  return new Set(["/login", "/register", "/refresh-auth-token"]).has(path);
};

export const sellerBaseQueryWithReauth: typeof authBase = async (
  args,
  api,
  extra
) => {
  let res = await authBase(args as FetchArgs, api, extra);
  const err = (res as any)?.error;
  const status = err?.status ?? err?.data?.statusCode;

  if (
    status === 401 &&
    !shouldSkip(typeof args === "string" ? args : (args as FetchArgs).url!)
  ) {
    const refresh = await authBase(
      { url: "/refresh-auth-token", method: "POST" },
      api,
      extra
    );
    const data = (refresh as any)?.data;
    if (data?.data?.access_token) {
      api.dispatch(
        loginSuccess({
          user: (api.getState() as RootState).sellerAuth.user!,
          token: data.data.access_token,
          refreshToken: data.data.refresh_token ?? null,
        })
      );
      res = await authBase(args as FetchArgs, api, extra);
    } else {
      api.dispatch(logout());
    }
  }
  return res;
};
