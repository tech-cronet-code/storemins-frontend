// src/routes/SellerRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSellerAuth } from "../modules/auth/contexts/SellerAuthContext";

const SellerRoute = () => {
  const { loading, userDetails } = useSellerAuth();
  const location = useLocation();

  if (loading || userDetails === undefined) return <div>Loading...</div>;

  // Some APIs return { success, data }, others return the DTO directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (userDetails as any)?.data ?? userDetails;

  const storeLinks = Array.isArray(profile?.storeLinks)
    ? profile.storeLinks
    : [];
  const hasStoreDetails = storeLinks.length > 0;
  const isDomainLinked = profile?.isDomainLinked === true;

  const path = location.pathname;

  // 1) If store details are missing → must stay on /seller/store-details
  if (!hasStoreDetails && path !== "/seller/store-details") {
    return <Navigate to="/seller/store-details" replace />;
  }

  // 2) If store details exist:
  if (hasStoreDetails) {
    // 2a) Block the store-details page (user shouldn’t be able to go back)
    if (path === "/seller/store-details") {
      // if domain not linked yet, continue onboarding at unlock step; else go dashboard
      return (
        <Navigate
          to={isDomainLinked ? "/seller" : "/seller/store-unlock"}
          replace
        />
      );
    }

    // 2b) If domain is NOT linked, force user to /seller/store-unlock
    if (!isDomainLinked && path !== "/seller/store-unlock") {
      return <Navigate to="/seller/store-unlock" replace />;
    }

    // 2c) If domain IS linked and user tries to hit unlock page, send to dashboard
    if (isDomainLinked && path === "/seller/store-unlock") {
      return <Navigate to="/seller" replace />;
    }
  }

  // 3) Otherwise, allow nested seller routes
  return <Outlet />;
};

export default SellerRoute;
