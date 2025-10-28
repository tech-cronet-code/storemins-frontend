// src/modules/dashboard/components/Layout.tsx
import { ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProductSettingsDrawer from "../../seller/components/ProductSettingsDrawer";

interface LayoutProps {
  role: UserRoleName;
  children?: ReactNode;
  hideFooter?: boolean; // 👈 NEW
}

const Layout = ({ role, children, hideFooter = false }: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex flex-col min-w-0 flex-1 transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-4">
          {children || <Outlet context={{ setDrawerOpen }} />}
        </main>

        {/* 👇 Footer now optional */}
        {!hideFooter && <Footer />}
      </div>

      <ProductSettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCheckoutFieldSelect={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default Layout;
