// src/routes/SellerRoute.tsx
import { useAuth } from "../modules/user/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const SellerRoute = () => {
  const { user } = useAuth();
  return user?.role === "SELLER" ? <Outlet /> : <Navigate to="/" />;
};

export default SellerRoute;
