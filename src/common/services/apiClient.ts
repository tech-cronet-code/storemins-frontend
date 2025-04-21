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

export const apiClient = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_URL_RUNTIME + "/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    getUserDetails: builder.query<User, void>({
      query: () => "/user",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
} = apiClient;
