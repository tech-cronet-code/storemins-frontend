// src/routes/AdminRoute.tsx
import { Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/user/auth/constants/userRoles";
import { useAuth } from "../modules/user/auth/context/AuthContext";

const AdminRoute = () => {
  const { user,loading } = useAuth();

    if (loading) return <div>Loading...</div>;
  
    if (Array.isArray(user?.role) && user.role.includes(UserRoleName.SUPERADMIN)) {
      return <Outlet />;
    }
  // return user?.role === "SUPERADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
