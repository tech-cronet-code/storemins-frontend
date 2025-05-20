// Layout.tsx
import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  role: UserRoleName;
  children?: ReactNode;
}

const Layout = ({ role, children }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex flex-col min-w-0 flex-1 transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-4">{children || <Outlet />}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
