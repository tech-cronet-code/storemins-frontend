// src/common/services/baseQueryWithReauth.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserRoleName } from "../../modules/user/auth/constants/userRoles";
import { loginSuccess, logout } from "../state/slices/authSlice";
import { RootState } from "../state/store";
import { User } from "../types/user";
import { castToUserRoles } from "../utils/common";

interface RefreshResponse {
    access_token: string;
    refresh_token: string;
    id: string;
    name?: string;
    mobile: string;
    role: UserRoleName[];
    permissions: string[];
    mobile_confirmed?: boolean;
}

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL_RUNTIME + "/auth",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result, "result");

    const errorData = result.error?.data as { statusCode?: number } | undefined;
    console.log(errorData, "errorData");

    const requestUrl = typeof args === "string" ? args : args.url;

    // 🚫 Don't try refreshing if it's login or register endpoint
    const skipRefresh = ["/login", "/register"].includes(requestUrl);

    if (result.error && errorData?.statusCode === 401 && !skipRefresh) {
        const retried = (extraOptions as any)?.__isRetryAttempt;
        if (retried) {
            console.warn("❌ Refresh retry already attempted, logging out.");
            api.dispatch(logout());
            // 🔁 Optional: Reload page if refresh token failed
            //  showToast({ type: "error", message: "Session expired. Reloading..." });
            //  setTimeout(() => {
            //      window.location.reload(); // full app reload
            //  }, 100);
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: "/refresh-auth-token",
                method: "POST",
                credentials: "include",
            },
            api,
            extraOptions
        );

        const data = refreshResult.data as RefreshResponse;

        if (data) {
            const { access_token, refresh_token } = data;

            const user: User = {
                id: data.id,
                name: data.name || "",
                mobile: data.mobile,
                role: castToUserRoles(data.role),
                permissions: data.permissions,
                mobile_confirmed: data.mobile_confirmed ?? false,
            };

            api.dispatch(
                loginSuccess({
                    user,
                    token: access_token,
                    refreshToken: refresh_token,
                })
            );

            // 🔁 Retry the original request once
            result = await baseQuery(args, api, {
                ...extraOptions,
                __isRetryAttempt: true,
            });
        } else {
            api.dispatch(logout());

            // // 🔁 Optional: Reload page if refresh token failed
            // showToast({ type: "error", message: "Session expired. Reloading..." });
            // setTimeout(() => {
            //     window.location.reload(); // full app reload
            // }, 100);
        }
    } else if (errorData?.statusCode === 500) {
        console.error("Server error");
    }

    return result;
};
