// src/routes/AdminRoute.tsx
import { useAuth } from "../modules/user/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
