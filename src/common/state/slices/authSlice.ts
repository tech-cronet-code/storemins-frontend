import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
const tokenFromStorage = localStorage.getItem("auth_token");
const userFromStorage = localStorage.getItem("auth_user");


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  needsOtp?: boolean;
}

const initialState: AuthState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage ?? null,
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

      // ✅ Optional: store token for persistence across page reloads
      localStorage.setItem("auth_token", action.payload.token);
      localStorage.setItem("auth_user", JSON.stringify({
        id: action.payload.user.id,
        name: action.payload.user.name,
        role: action.payload.user.role,
        permissions: action.payload.user.permissions,
      })); // ✅ Store user
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
      localStorage.removeItem("auth_token"); // clear
      localStorage.removeItem("auth_user"); // ✅ Clear user
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false; // ✅ set loading false here too
    },
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
  registerSuccess,
} = authSlice.actions;

export default authSlice.reducer;
