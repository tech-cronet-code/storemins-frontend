import { Navigate } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

export const getDefaultRouteForRoles = (roles?: UserRoleName[] | null) => {
  if (!roles || roles.length === 0) return "/home";
  const set = new Set(roles);
  if (set.has(UserRoleName.ADMIN)) return "/admin";
  if (set.has(UserRoleName.SELLER)) return "/seller";
  if (set.has(UserRoleName.CUSTOMER)) return "/customer";
  return "/home";
};

const RoleHomeRedirect = () => {
  const { rolesArray } = useSellerAuth();

  const to = getDefaultRouteForRoles(rolesArray);
  return <Navigate to={to} replace />;
};

export default RoleHomeRedirect;
