// src/common/state/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auth/slices/authSlice";
import { apiClient } from "../../modules/auth/services/authApi";
import { productApi } from "../../modules/auth/services/productApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiClient.reducerPath]: apiClient.reducer,
    [productApi.reducerPath]: productApi.reducer, // <-- REGISTER PRODUCT API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/loginSuccess",
          "auth/registerSuccess",
          "persist/PERSIST",
        ],
        ignoredPaths: ["auth.user"],
      },
      immutableCheck: true,
    })
      .concat(apiClient.middleware)
      .concat(productApi.middleware), // <-- CONCAT PRODUCT API MIDDLEWARE
  devTools: import.meta.env.VITE_MODE === "development",
});

// Typings
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
