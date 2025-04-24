// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/user/auth/context/AuthContext";
import { UserRoleName } from "../modules/user/auth/constants/userRoles";

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    // 🚧 If user is logged in but hasn't verified mobile, redirect to /otp-verify
    if (!user.mobile_confirmed) {
      return <Navigate to="/otp-verify" replace />;
    }

    // ✅ Redirect based on role
    if (user?.role?.includes(UserRoleName.SELLER)) {
      return <Navigate to="/seller" replace />;
    }

    if (user?.role?.includes(UserRoleName.ADMIN)) {
      return <Navigate to="/admin" replace />;
    }

    // 🌐 Fallback for other roles
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
