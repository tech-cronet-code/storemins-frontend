import { Navigate, Outlet } from "react-router-dom";
import { UserRoleName } from "../modules/user/auth/constants/userRoles";
import { useAuth } from "../modules/user/auth/context/AuthContext";

const SellerRoute = () => {
  const { user, loading } = useAuth();

  console.log(user, "userSelllerRoute");
  console.log(Array.isArray(user?.role) && user.role.includes(UserRoleName.SELLER), "userSelllerRoute condi");

  

  // useEffect(() => {
  //   console.log(user, "useruser");
  // }, [user]);

  if (loading) return <div>Loading...</div>;

  if (Array.isArray(user?.role) && user.role.includes(UserRoleName.SELLER)) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default SellerRoute;
