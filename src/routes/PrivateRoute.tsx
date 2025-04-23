// src/routes/PrivateRoute.tsx
import { useAuth } from "../modules/user/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useAuth();
  console.log(user, "userPrivateRoute.tsx");
  
  return user ? <Outlet /> : <Navigate to="/home" />;
};

export default PrivateRoute;
