// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./common/state/store";
import { AuthProvider } from "./modules/user/auth/context/AuthContext.tsx";
import { Toaster } from 'react-hot-toast';

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
        <App />
        <Toaster position="top-center" gutter={8} />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
