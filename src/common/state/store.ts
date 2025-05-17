// src/common/state/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auth/slices/authSlice";
import { apiClient } from "../../modules/auth/services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiClient.reducerPath]: apiClient.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Avoid false warnings when using Date, class instances, etc.
        ignoredActions: [
          "auth/loginSuccess",
          "auth/registerSuccess",
          "persist/PERSIST",
        ],
        ignoredPaths: ["auth.user"], // if storing non-serializable user info
      },
      immutableCheck: true,
    }).concat(apiClient.middleware),
  devTools: import.meta.env.VITE_MODE === "development", // 🔒 disable Redux DevTools in production
});

// Typings
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
