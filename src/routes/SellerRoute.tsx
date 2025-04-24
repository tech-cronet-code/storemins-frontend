import { Navigate, Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/user/auth/constants/userRoles";
import { useAuth } from "../modules/user/auth/context/AuthContext";

const SellerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !Array.isArray(user.role) || !user.role.includes(UserRoleName.SELLER)) {
    return <Navigate to="/home" />;
  }

  if (user.role.includes(UserRoleName.SELLER)) {
    return <Outlet />;
  }

  return <Navigate to="/home" replace />;
};

export default SellerRoute;
