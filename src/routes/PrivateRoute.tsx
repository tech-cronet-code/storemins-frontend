import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log("PrivateRoute loaded", user);

  if (!user) return <Navigate to="/home" replace />;

  if (user.mobile_confirmed  === false) {
    return <Navigate to="/otp-verify" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
 