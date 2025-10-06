import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";
import { getDefaultRouteForRoles } from "./RoleHomeRedirect";

const PublicRoute = () => {
  const { user } = useAuth();

  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  if (persistedQuickLogin) {
    return <Navigate to="/otp-verify" replace />;
  }

  if (user && user.mobile_confirmed === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  if (user && user.mobile_confirmed === true) {
    return <Navigate to={getDefaultRouteForRoles(user.role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
