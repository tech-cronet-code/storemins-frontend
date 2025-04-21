import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  needsOtp?: boolean; // Optional: for OTP step tracking
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  needsOtp: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.needsOtp = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.needsOtp = false;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    // ✅ New for Register
    registerSuccess(state, action: PayloadAction<{
      user: User;
      token?: string;
      needsOtp?: boolean;
    }>) {
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.needsOtp = action.payload.needsOtp ?? false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  registerSuccess, // Export this
} = authSlice.actions;

export default authSlice.reducer;
