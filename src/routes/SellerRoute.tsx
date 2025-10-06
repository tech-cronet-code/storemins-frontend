// src/routes/SellerRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/contexts/AuthContext";

const SellerRoute = () => {
  const { loading, userDetails } = useAuth();
  const location = useLocation();

  if (loading || userDetails === undefined) return <div>Loading...</div>;

  // unwrap envelope if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (userDetails as any)?.data ?? userDetails;

  const storeLinks = Array.isArray(profile?.storeLinks)
    ? profile.storeLinks
    : [];
  const hasStoreDetails = storeLinks.length > 0;
  const isDomainLinked = profile?.isDomainLinked === true;

  // onboarding redirects – do them only once per state
  if (!hasStoreDetails && location.pathname !== "/seller/store-details") {
    return <Navigate to="/seller/store-details" replace />;
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
