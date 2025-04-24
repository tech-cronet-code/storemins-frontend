import { UserRoleName } from "../modules/user/auth/constants/userRoles";
import { useAuth } from "../modules/user/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !user.role) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Ensure user.role is treated as an array
  const roles = Array.isArray(user.role) ? user.role : [user.role];

  // ✅ Check if user has at least one role that is NOT GUEST
  const hasNonGuestRole = roles.some(role => role !== UserRoleName.GUEST);

  if (!hasNonGuestRole) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
 