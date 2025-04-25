import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/user/auth/context/AuthContext";

const OtpRoute = () => {
  console.log("OtpRoute loaded");

  const { user } = useAuth();
  console.log("OtpRoute loaded", user);

  if (!user) return <Navigate to="/home" replace />;
  
  // If mobile is confirmed, navigate to the seller dashboard
  if (user.mobile_confirmed === true) {
    return <Navigate to="/seller" replace />;
  }

  return <Outlet />;
};

export default OtpRoute;
