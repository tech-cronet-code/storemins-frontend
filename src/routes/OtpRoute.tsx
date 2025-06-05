import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const OtpRoute = () => {
  console.log("OtpRoute loaded");

  const { user, quickLoginEnabledFlag } = useAuth();

  // Save the flag in localStorage on first render
  if (quickLoginEnabledFlag) {
    localStorage.setItem("quick_login_enabled", "true");
  }

  // Read from localStorage in case user is null (e.g., after refresh)
  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  console.log("OtpRoute loaded", user);
  console.log("OtpRoute quickLoginEnabledFlag", quickLoginEnabledFlag);

  // If no quick login and no user → redirect to /home
  if (!persistedQuickLogin && !user) {
    return <Navigate to="/home" replace />;
  }

  // If mobile is already confirmed, go to seller dashboard
  if (user?.mobile_confirmed === true) {
    return <Navigate to="/seller" replace />;
  }

  // localStorage.removeItem("quick_login_enabled"); // ✅ clear the quick login flag

  // Render OTP verification page
  return <Outlet />;
};

export default OtpRoute;
