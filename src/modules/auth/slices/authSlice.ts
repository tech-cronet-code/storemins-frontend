// // src/app/slices/authSlice.ts

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "../types/authTypes";

// const userFromStorage = localStorage.getItem("auth_user");
// const tokenFromStorage = localStorage.getItem("auth_token"); // ✅ Load token

// interface AuthState {
//   userDetails: any;
//   user: User | null;
//   token: string | null; // access_token
//   refreshToken: string | null; // stored in redux; cookie used server-side
//   loading: boolean;
//   error: string | null;
//   needsOtp?: boolean;
//   quickLoginEnable?: boolean;
// }

// const initialState: AuthState = {
//   user: userFromStorage ? JSON.parse(userFromStorage) : null,
//   token: tokenFromStorage ?? null,
//   refreshToken: null,
//   loading: false,
//   error: null,
//   needsOtp: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     loginSuccess(
//       state,
//       action: PayloadAction<{ user: User; token: string; refreshToken: string }>
//     ) {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.refreshToken = action.payload.refreshToken;
//       state.error = null;
//       state.needsOtp = false;

//       // Persist minimal auth state (access token + user snapshot)
//       localStorage.setItem("auth_token", action.payload.token);
//       localStorage.setItem(
//         "auth_user",
//         JSON.stringify({
//           id: action.payload.user.id,
//           name: action.payload.user.name,
//           role: action.payload.user.role,
//           permissions: action.payload.user.permissions,
//           mobile_confirmed: action.payload.user.mobile_confirmed,
//           mobile: action.payload.user.mobile,
//           otpExpiresAt: action.payload.user.otpExpiresAt, // optional
//         })
//       );
//     },

//     loginFailure(state, action: PayloadAction<string>) {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.refreshToken = null;
//       state.loading = false;
//       state.error = null;
//       state.needsOtp = false;

//       localStorage.removeItem("auth_user");
//       localStorage.removeItem("auth_token");
//     },

//     setUser(state, action: PayloadAction<User>) {
//       state.user = action.payload;
//       state.loading = false;
//     },

//     registerSuccess(
//       state,
//       action: PayloadAction<{
//         user: User;
//         token: string;
//         refreshToken: string;
//         needsOtp?: boolean;
//       }>
//     ) {
//       state.user = action.payload.user;
//       state.token = action.payload.token ?? null;
//       state.refreshToken = action.payload.refreshToken ?? null;
//       state.needsOtp = action.payload.needsOtp ?? false;
//       state.loading = false;
//       state.error = null;

//       // Persist (token may be null in OTP-first until exchange step)
//       localStorage.setItem("auth_token", action.payload.token ?? "Null");
//       localStorage.setItem(
//         "auth_user",
//         JSON.stringify({
//           id: action.payload.user.id,
//           name: action.payload.user.name,
//           role: action.payload.user.role,
//           permissions: action.payload.user.permissions,
//           mobile_confirmed: action.payload.user.mobile_confirmed,
//           mobile: action.payload.user.mobile,
//           otpExpiresAt: action.payload.user.otpExpiresAt,
//         })
//       );
//     },

//     confirmOtpSuccess(
//       state,
//       action: PayloadAction<{ mobile_confirmed: boolean }>
//     ) {
//       if (state.user) {
//         state.user.mobile_confirmed = action.payload.mobile_confirmed;
//         state.needsOtp = !action.payload.mobile_confirmed;
//       }
//     },

//     // Optional helper if you want to toggle OTP flag from UI
//     setNeedsOtp(state, action: PayloadAction<boolean>) {
//       state.needsOtp = action.payload;
//     },
//   },
// });

// export const {
//   loginStart,
//   loginSuccess,
//   loginFailure,
//   logout,
//   setUser,
//   registerSuccess,
//   confirmOtpSuccess,
//   setNeedsOtp, // optional
// } = authSlice.actions;

// export default authSlice.reducer;
