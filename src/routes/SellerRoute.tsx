// src/routes/SellerRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRoleName } from "../modules/auth/constants/userRoles";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const SellerRoute = () => {
  const { user, loading, userDetails } = useAuth();
  const location = useLocation();

  // ✅ 1) wait for auth *and* profile to finish loading
  if (loading || userDetails === undefined) {
    return <div>Loading...</div>;
  }

  // 2) enforce SELLER role
  const isSeller =
    user && Array.isArray(user.role) && user.role.includes(UserRoleName.SELLER);

  if (!isSeller) {
    return <Navigate to="/home" />;
  }

  // 3) unwrap envelope if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (userDetails as any)?.data ?? userDetails;
  const storeLinks = Array.isArray(profile.storeLinks)
    ? profile.storeLinks
    : [];
  const hasStoreDetails = storeLinks.length > 0;
  const isDomainLinked = profile.isDomainLinked === true;

  console.log(hasStoreDetails, "hasStoreDetails");
  console.log(userDetails, "userDetails");
  console.log(location.pathname, "location.pathname");

  // 4) only redirect *once* when everything is settled
  if (!hasStoreDetails && location.pathname !== "/seller/store-details") {
    return <Navigate to="/seller/store-details" replace />;
  }

  if (hasStoreDetails && location.pathname === "/seller/store-details") {
    return <Navigate to="/seller/store-unlock" replace />;
  }

  if (
    hasStoreDetails &&
    !isDomainLinked &&
    location.pathname !== "/seller/store-unlock"
  ) {
    return <Navigate to="/seller/store-unlock" replace />;
  }

  if (isDomainLinked && location.pathname === "/seller/store-unlock") {
    return <Navigate to="/seller" replace />;
  } 

  return <Outlet />;
};

export default SellerRoute;
