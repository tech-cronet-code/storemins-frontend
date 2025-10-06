import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";
import { UserRoleName } from "../modules/auth/constants/userRoles";

export const getDefaultRouteForRoles = (roles?: UserRoleName[] | null) => {
  if (!roles || roles.length === 0) return "/home";
  const set = new Set(roles);
  if (set.has(UserRoleName.ADMIN)) return "/admin";
  if (set.has(UserRoleName.SELLER)) return "/seller";
  if (set.has(UserRoleName.CUSTOMER)) return "/customer";
  return "/home";
};

const RoleHomeRedirect = () => {
  const { user } = useAuth();
  const to = getDefaultRouteForRoles(user?.role);
  return <Navigate to={to} replace />;
};

export default RoleHomeRedirect;
