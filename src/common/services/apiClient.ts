//  apiClient.ts for REGISTER

import { createApi } from "@reduxjs/toolkit/query/react";
import { UserRoleName } from "../../modules/user/auth/constants/userRoles";
import { User } from "../types/user";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

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
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    quickLoginInfo: {
      id: string;
      name?: string;
      mobile: string;
      role?: string[]; // or UserRoleName[]
      permissions?: string[];
      access_token: string;
      refresh_token: string;
      tenentId?: string | null;
      mobile_confirmed: boolean;
    };
    needs_confirm_otp_code: boolean;
  };
}


interface LoginPayload {
  mobile: string;
  password: string;
}


export const apiClient = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "apiClient",
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
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
      query: () => ({
        url: "/my-profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
} = apiClient;
