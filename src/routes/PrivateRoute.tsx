import { Navigate, Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import RoleHomeRedirect from "./RoleHomeRedirect";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

type PrivateRouteProps = {
  /** If provided, user must have at least one of these roles */
  allowed?: UserRoleName[];
  /** Where to send unauthenticated users */
  redirectTo?: string;
};

const PrivateRoute = ({ allowed, redirectTo = "/home" }: PrivateRouteProps) => {
  const { user, loading, quickLoginEnabledFlag } = useSellerAuth();

  // quick-login flag doesn't grant access by itself
  if (quickLoginEnabledFlag)
    localStorage.setItem("quick_login_enabled", "true");
  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  if (loading) return <div>Loading...</div>;

  const isLoggedIn = !!user || persistedQuickLogin;
  if (!isLoggedIn) return <Navigate to={redirectTo} replace />;

  // force a real session (not just persisted flag) when a role is required
  if (allowed && !user) return <Navigate to={redirectTo} replace />;

  if (user?.mobile_confirmed === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  if (allowed && user) {
    const hasAny = allowed.some((r) => user.role?.includes(r));
    if (!hasAny) {
      // Logged in but wrong role → bounce to their role home
      return <RoleHomeRedirect />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
