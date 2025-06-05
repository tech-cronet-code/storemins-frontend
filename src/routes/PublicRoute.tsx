import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  // ✅ Block access to public routes if quick login is in progress
  if (persistedQuickLogin) {
    return <Navigate to="/otp-verify" replace />;
  }

  // ✅ If logged in but not confirmed, go to OTP
  if (user && user.mobile_confirmed === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  // ✅ If logged in and confirmed, go to seller dashboard
  if (user && user.mobile_confirmed === true) {
    return <Navigate to="/seller" replace />;
  }

  // ✅ Otherwise, allow access to public routes like /home
  // TODO:  -- Reset the flag after OTP === localStorage.removeItem("quick_login_enabled");
  return <Outlet />;
};

export default PublicRoute;
