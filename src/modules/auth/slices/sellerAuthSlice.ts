import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/authTypes";

const userFromStorage = localStorage.getItem("seller_auth_user");
const tokenFromStorage = localStorage.getItem("seller_auth_token");

interface AuthState {
  user: User | null;
  token: string | null; // access token
  refreshToken: string | null; // optional: store if BE returns it
  loading: boolean;
  error: string | null;
  needsOtp?: boolean;
  quickLoginEnable?: boolean; // parity with old slice
}

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage ?? null,
  refreshToken: null,
  loading: false,
  error: null,
  needsOtp: false,
  quickLoginEnable: undefined,
};

const slice = createSlice({
  name: "sellerAuth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    // keep refreshToken optional to avoid TS hassles when BE omits it
    loginSuccess(
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string | null;
      }>
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.error = null;
      state.needsOtp = false;

      localStorage.setItem("seller_auth_token", action.payload.token);
      localStorage.setItem(
        "seller_auth_user",
        JSON.stringify({
          id: action.payload.user.id,
          name: action.payload.user.name,
          role: action.payload.user.role,
          permissions: action.payload.user.permissions,
          mobile_confirmed: action.payload.user.mobile_confirmed,
          mobile: action.payload.user.mobile,
          otpExpiresAt: action.payload.user.otpExpiresAt,
        })
      );
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.needsOtp = false;
      state.quickLoginEnable = undefined;

      localStorage.removeItem("seller_auth_user");
      localStorage.removeItem("seller_auth_token");
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;

      // keep LS snapshot in sync (optional)
      localStorage.setItem(
        "seller_auth_user",
        JSON.stringify({
          id: action.payload.id,
          name: action.payload.name,
          role: action.payload.role,
          permissions: action.payload.permissions,
          mobile_confirmed: action.payload.mobile_confirmed,
          mobile: action.payload.mobile,
          otpExpiresAt: action.payload.otpExpiresAt,
        })
      );
    },

    // used when register API returns tokens & a user snapshot
    registerSuccess(
      state,
      action: PayloadAction<{
        user: User;
        token: string | null;
        refreshToken: string | null;
        needsOtp?: boolean;
        quickLoginEnable?: boolean;
      }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.needsOtp = action.payload.needsOtp ?? false;
      state.quickLoginEnable = action.payload.quickLoginEnable ?? false;
      state.loading = false;
      state.error = null;

      localStorage.setItem("seller_auth_token", action.payload.token ?? "Null");
      localStorage.setItem(
        "seller_auth_user",
        JSON.stringify({
          id: action.payload.user.id,
          name: action.payload.user.name,
          role: action.payload.user.role,
          permissions: action.payload.user.permissions,
          mobile_confirmed: action.payload.user.mobile_confirmed,
          mobile: action.payload.user.mobile,
          otpExpiresAt: action.payload.user.otpExpiresAt,
        })
      );
    },

    confirmOtpSuccess(
      state,
      action: PayloadAction<{ mobile_confirmed: boolean }>
    ) {
      if (state.user) {
        state.user.mobile_confirmed = action.payload.mobile_confirmed;
        state.needsOtp = !action.payload.mobile_confirmed;

        localStorage.setItem("seller_auth_user", JSON.stringify(state.user));
      }
    },

    setNeedsOtp(state, action: PayloadAction<boolean>) {
      state.needsOtp = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  registerSuccess,
  confirmOtpSuccess,
  setNeedsOtp,
} = slice.actions;

export default slice.reducer;
