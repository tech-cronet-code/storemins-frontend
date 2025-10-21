import { Navigate, Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import RoleHomeRedirect from "./RoleHomeRedirect";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

function resolveSlugFromPathname(pathname: string): string | null {
  const first = pathname.split("/").filter(Boolean)[0];
  const reserved = new Set([
    "home",
    "otp-verify",
    "customer",
    "seller",
    "admin",
    "api",
    "profile",
    "auth",
    "login",
    "signup",
    "dashboard",
  ]);
  return first && !reserved.has(first) ? first : null;
}

type PrivateRouteProps = {
  allowed?: UserRoleName[];
  redirectTo?: string;
};

const PrivateRoute = ({ allowed, redirectTo = "/home" }: PrivateRouteProps) => {
  const { user, loading, quickLoginEnabledFlag } = useSellerAuth();

  if (quickLoginEnabledFlag)
    localStorage.setItem("quick_login_enabled", "true");
  const persistedQuickLogin =
    localStorage.getItem("quick_login_enabled") === "true";

  if (loading) return <div>Loading...</div>;

  const isLoggedIn = !!user || persistedQuickLogin;
  if (!isLoggedIn) {
    const slug = resolveSlugFromPathname(window.location.pathname);
    return <Navigate to={slug ? `/${slug}` : redirectTo} replace />;
  }

  if (allowed && !user) return <Navigate to={redirectTo} replace />;
  if (user?.mobile_confirmed === false)
    return <Navigate to="/otp-verify" replace />;

  if (allowed && user) {
    const hasRole = allowed.some((r) => user.role?.includes(r));
    if (!hasRole) return <RoleHomeRedirect />;
  }

  return <Outlet />;
};

export default PrivateRoute;
