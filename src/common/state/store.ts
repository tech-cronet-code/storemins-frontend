// src/common/state/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auth/slices/authSlice";

// Root RTK Query slice
import { apiClient } from "../../modules/auth/services/authApi";

// Separate API slices created with createApi (not injectEndpoints)
import { productApi } from "../../modules/auth/services/productApi";
import { storeApi } from "../../modules/auth/services/storeApi";
import { storefrontPublicApi } from "../../modules/auth/services/storefrontPublicApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // Register each unique reducerPath exactly once
    [apiClient.reducerPath]: apiClient.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [storefrontPublicApi.reducerPath]: storefrontPublicApi.reducer,
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
      // Add middleware once per unique API
      .concat(apiClient.middleware)
      .concat(productApi.middleware)
      .concat(storeApi.middleware)
      .concat(storefrontPublicApi.middleware),
  devTools: import.meta.env.VITE_MODE === "development",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
