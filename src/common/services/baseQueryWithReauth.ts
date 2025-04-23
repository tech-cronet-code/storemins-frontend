// src/common/services/baseQueryWithReauth.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../state/store";
import { loginSuccess, logout } from "../state/slices/authSlice";
import { UserRoleName } from "../../modules/user/auth/constants/userRoles";
import { User } from "../types/user";
import { castToUserRoles } from "../utils/common";


interface RefreshResponse {
    access_token: string;
    refresh_token: string;
    id: string;
    name?: string;
    mobile: string;
    role: UserRoleName[]; // or UserRoleName[]
    permissions: string[];
    mobile_confirmed?: boolean;
}



const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL_RUNTIME + "/auth",
    credentials: "include", // ✅ send cookies on every request
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result, "result");

    const errorData = result.error?.data as { statusCode?: number };

    if (result.error) {
        if (errorData?.statusCode === 401) {
            // token expired – try refresh
        } else if (errorData?.statusCode === 500) {
            console.error("Server error");

            // ⛔️ NO localStorage for refresh token anymore
            // const refreshToken = localStorage.getItem("auth_refresh");
            // if (!refreshToken) {
            //   api.dispatch(logout());
            //   return result;
            // }

            // ✅ Request refresh using HttpOnly cookie
            const refreshResult = await baseQuery(
                {
                    url: "/refresh-auth-token",
                    method: "POST",
                    // ⚠️ No body – cookies are automatically sent by browser
                    credentials: "include", // ✅ send HttpOnly refresh cookie
                },
                api,
                extraOptions
            );

            const data = refreshResult.data as RefreshResponse;

            if (data) {
                const {
                    access_token,
                    refresh_token,
                } = data;

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
                        refreshToken: refresh_token, // still stored in state (but NOT localStorage)
                    })
                );

                // ✅ Do NOT store access_token or refresh_token
                // localStorage.setItem("auth_token", access_token); ❌
                // localStorage.setItem("auth_refresh", refresh_token); ❌

                // ✅ (Optional) keep lightweight user info in localStorage
                localStorage.setItem("auth_user", JSON.stringify(user));

                // 🔁 Retry the original failed request
                result = await baseQueryWithReauth(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }
    }
    return result;
};

