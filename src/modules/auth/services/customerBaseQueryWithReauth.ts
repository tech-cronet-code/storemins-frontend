// customer base query (only the baseUrl part changes)
import { fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../../common/state/store";
import { loginSuccess, logout } from "../slices/customerAuthSlice";
import { getApiRoot } from "../../../common/config/runtime";

// ✅ getApiRoot() should return '' or undefined in dev (see note below)
const API_ROOT = getApiRoot() || (import.meta.env.DEV ? "/" : "/");

const rootBase = fetchBaseQuery({
  baseUrl: API_ROOT,
  credentials: "include",
  prepareHeaders: (h, api) => {
    const state = api.getState() as RootState;
    const token = state.customerAuth.token;
    if (token) h.set("Authorization", `Bearer ${token}`);

    // business header you already use
    const bizMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="business-id"]'
    );
    const biz = bizMeta?.content?.trim() || "";
    if (biz) h.set("x-business-id", biz);

    // ⬇️ session header fallback (see #2)
    const sid = localStorage.getItem("sid");
    if (sid) h.set("x-session-id", sid);

    return h;
  },
});

export const customerBaseQueryWithReauth: typeof rootBase = async (
  args,
  api,
  extra
) => {
  let res = await rootBase(args as FetchArgs, api, extra);

  // ⬇️ persist sid from response (works even if cookies are blocked)
  const sid = res?.meta?.response?.headers?.get?.("x-session-id");
  if (sid) localStorage.setItem("sid", sid);

  const err = (res as any)?.error;
  const status = err?.status ?? err?.data?.statusCode;

  if (
    status === 401 &&
    !new Set([
      "/customer/auth/login-init",
      "/customer/auth/register",
      "/customer/auth/confirm-mobile-otp",
      "/customer/auth/resend-mobile-otp",
      "/customer/auth/logout",
      "/customer/auth/refresh-auth-token",
    ]).has(typeof args === "string" ? args : (args as FetchArgs).url!)
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
