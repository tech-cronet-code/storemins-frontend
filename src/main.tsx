// src/main.tsx
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./common/state/store";
import { StrictMode } from "react";
import { AuthProvider } from "./modules/auth/contexts/AuthContext.tsx";
import { SellerProductProvider } from "./modules/seller/context/SellerProductContext.tsx";

if (import.meta.env.VITE_MODE === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Optional: disable warnings and errors too
  console.warn = () => {};
  console.error = () => {};
}

// Optional: global error handler for uncaught app-level errors
window.addEventListener("error", (e) => {
  console.error("🌐 Global Error:", e.message);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("🔁 Unhandled Promise:", e.reason);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SellerProductProvider>
          <App />
          <Toaster position="top-center" gutter={8} />
        </SellerProductProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
