import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";
// const tokenFromStorage = localStorage.getItem("auth_token");
const userFromStorage = localStorage.getItem("auth_user");
// const refreshTokenFromStorage = localStorage.getItem("auth_refresh");
const tokenFromStorage = localStorage.getItem("auth_token"); // ✅ Load token


interface AuthState {
  user: User | null;
  token: string | null; // access_token
  refreshToken: string | null; // ⚠️ optional now, move to cookies later
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      state.needsOtp = false;
    
      // Store securely (will move to cookies or HTTP-only storage in future)
      // localStorage.setItem("auth_token", action.payload.token);
      localStorage.setItem("auth_token", action.payload.token); // ✅ Save token
      localStorage.setItem("auth_user", JSON.stringify({
        id: action.payload.user.id,
        name: action.payload.user.name,
        role: action.payload.user.role,
        permissions: action.payload.user.permissions,
      }));
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
      // localStorage.removeItem("auth_token"); // clear
      localStorage.removeItem("auth_user"); // ✅ Clear user
      localStorage.removeItem("auth_token"); // ✅ Clear token on logout

      // localStorage.removeItem("auth_refresh");
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
