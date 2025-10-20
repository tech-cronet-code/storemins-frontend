// src/modules/auth/slices/customerAuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CustomerUser {
  id: string;
  name?: string;
  mobile: string;
  role?: string[];
  permissions?: string[];
  mobile_confirmed?: boolean;
  otpExpiresAt?: string | null;
}

const userFromStorage = localStorage.getItem("customer_auth_user");
const tokenFromStorage = localStorage.getItem("customer_auth_token");

interface AuthState {
  user: CustomerUser | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  needsOtp?: boolean;
}

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage ?? null,
  refreshToken: null,
  loading: false,
  error: null,
  needsOtp: false,
};

const slice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    loginStart(s) {
      s.loading = true;
      s.error = null;
    },
    loginSuccess(
      s,
      a: PayloadAction<{
        user: CustomerUser;
        token: string;
        refreshToken?: string | null;
      }>
    ) {
      s.loading = false;
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.refreshToken = a.payload.refreshToken ?? null;
      s.error = null;
      s.needsOtp = false;
      localStorage.setItem("customer_auth_token", a.payload.token);
      localStorage.setItem(
        "customer_auth_user",
        JSON.stringify(a.payload.user)
      );
    },

    // ✅ NEW: same idea for customer
    registerSuccess(
      s,
      a: PayloadAction<{
        user: CustomerUser;
        token: string | null;
        refreshToken: string | null;
        needsOtp?: boolean;
      }>
    ) {
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.refreshToken = a.payload.refreshToken;
      s.needsOtp = a.payload.needsOtp ?? false;
      s.loading = false;
      s.error = null;

      localStorage.setItem("customer_auth_token", a.payload.token ?? "Null");
      localStorage.setItem(
        "customer_auth_user",
        JSON.stringify(a.payload.user)
      );
    },

    loginFailure(s, a: PayloadAction<string>) {
      s.loading = false;
      s.error = a.payload;
    },
    logout(s) {
      s.user = null;
      s.token = null;
      s.refreshToken = null;
      s.loading = false;
      s.error = null;
      s.needsOtp = false;
      localStorage.removeItem("customer_auth_user");
      localStorage.removeItem("customer_auth_token");
      localStorage.removeItem("quick_login_enabled");
    },
    setUser(s, a: PayloadAction<CustomerUser>) {
      s.user = a.payload;
      s.loading = false;
    },
    setNeedsOtp(s, a: PayloadAction<boolean>) {
      s.needsOtp = a.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  registerSuccess, // 👈 export
  loginFailure,
  logout,
  setUser,
  setNeedsOtp,
} = slice.actions;

export default slice.reducer;
