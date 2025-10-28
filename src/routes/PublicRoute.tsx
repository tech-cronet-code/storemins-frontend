import { Navigate, Outlet } from "react-router-dom";
import { getDefaultRouteForRoles } from "./RoleHomeRedirect";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

const PublicRoute = () => {
  const { user, rolesArray } = useSellerAuth();

  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  if (persistedQuickLogin) {
    return <Navigate to="/otp-verify" replace />;
  }

  if (user && user.mobile_confirmed === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  if (user && user.mobile_confirmed === true) {
    return <Navigate to={getDefaultRouteForRoles(rolesArray)} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
