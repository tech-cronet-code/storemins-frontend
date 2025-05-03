import Layout from "../components/Layout";
import { UserRoleName } from "../../auth/constants/userRoles";

const SellerDashboard = () => {
  return (
    <Layout role={UserRoleName.SELLER}>
      <div>
        <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
        <p>Manage your products and orders here.</p>
      </div>
    </Layout>
  );
};

export default SellerDashboard;