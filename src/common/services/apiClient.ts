//  apiClient.ts for REGISTER

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserRoleName } from "../../modules/user/auth/constants/userRoles";
import { RootState } from "../state/store";
import { User } from "../types/user";

export interface RegisterPayload {
  name: string;
  mobile: string;
  pass_hash: string;
  role: UserRoleName;
  isTermAndPrivarcyEnable: boolean;
}

export interface RegisterResponse {
  id: string;
  message?: string;
  needs_confirm_otp_code: boolean;
  quickRegisterInfo?: {
    id: string;
    mobile: string;
    mobile_confirmed: boolean;
  };
}


export interface LoginResponse {
  quickLoginInfo: {
    id: string;
    name?: string;
    mobile: string;
    role?: UserRoleName; // ✅ It's an array based on your backend
    permissions?: string[];
    access_token: string;
    refresh_token: string;
    tenentId?: string | null;
    mobile_confirmed: boolean;
  };
  needs_confirm_otp_code: boolean;
}

interface LoginPayload {
  mobile: string;
  password: string;
}


export const apiClient = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL_RUNTIME + "/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: LoginResponse }) => response.data,
    }),


    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    getUserDetails: builder.query<User, void>({
      query: () => "/my-profile",
      transformResponse: (response: { data: User }) => response.data,

    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
} = apiClient;
