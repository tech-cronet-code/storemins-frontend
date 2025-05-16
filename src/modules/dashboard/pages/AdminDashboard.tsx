// src/modules/dashboard/pages/AdminDashboard.tsx
import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../components/Layout";

const AdminDashboard = () => {
  return (
    <Layout role={UserRoleName.ADMIN}>
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Manage stores and users here.</p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
