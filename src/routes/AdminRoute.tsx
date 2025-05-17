// src/routes/AdminRoute.tsx
import { Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";
import { UserRoleName } from "../modules/auth/constants/userRoles";

const AdminRoute = () => {
  const { user,loading } = useAuth();

    if (loading) return <div>Loading...</div>;
  
    if (Array.isArray(user?.role) && user.role.includes(UserRoleName.SUPERADMIN)) {
      return <Outlet />;
    }
  // return user?.role === "SUPERADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
