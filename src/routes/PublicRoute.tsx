// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    if (user.mobile_confirmed === false) {
      return <Navigate to="/otp-verify" replace />;
    }
    return <Navigate to="/seller" replace />; // or role-based if needed
  }

  return <Outlet />;
};

export default PublicRoute;
