// src/routes/AdminRoute.tsx
import { Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

const AdminRoute = () => {
  const { user, loading } = useSellerAuth();

  if (loading) return <div>Loading...</div>;

  if (
    Array.isArray(user?.role) &&
    user.role.includes(UserRoleName.SUPERADMIN)
  ) {
    return <Outlet />;
  }
  // return user?.role === "SUPERADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
