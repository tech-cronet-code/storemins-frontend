import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const SellerRoute = () => {
  const { user, loading, userDetails } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  const isSeller =
    user && Array.isArray(user.role) && user.role.includes(UserRoleName.SELLER);

  if (!isSeller) {
    return <Navigate to="/home" />;
  }

  const hasStoreDetails =
    Array.isArray(userDetails?.storeLinks) && userDetails.storeLinks.length > 0;

  // ✅ Avoid redirecting to the same route
  if (!hasStoreDetails && location.pathname !== "/seller/store-details") {
    return <Navigate to="/seller/store-details" />;
  }

  return <Outlet />;
};

export default SellerRoute;
