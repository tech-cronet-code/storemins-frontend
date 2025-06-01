import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading, quickLoginEnabledFlag } = useAuth();

  // Save the flag in localStorage on first render
  if (quickLoginEnabledFlag) {
    localStorage.setItem("quick_login_enabled", "true");
  }

  // Read from localStorage in case user is null (e.g., after refresh)
  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  if (loading) return <div>Loading...</div>;
  console.log("PrivateRoute loaded", user);

  if (!user && !persistedQuickLogin) return <Navigate to="/home" replace />;

  if (user?.mobile_confirmed === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
