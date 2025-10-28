// CustomerLayout.tsx

import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerFooter from "./CustomerFooter";
import CustomerHeader from "./CustomerHeader";

interface CustomerLayoutProps {
  role: UserRoleName;
  children?: ReactNode;
}

const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <>
      <div>
        {/* Render Header and other components here */}
        <CustomerHeader />
        <main className="">{children || <Outlet />}</main>
        <CustomerFooter />
      </div>
    </>
  );
};

export default CustomerLayout;
