import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { UserRoleName } from "../../auth/constants/userRoles";

interface LayoutProps {
  role: UserRoleName;
  children?: ReactNode;
}

const Layout = ({ role, children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
