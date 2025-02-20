// src/modules/dashboard/pages/SellerDashboard.tsx

import Layout from "../components/Layout";

const SellerDashboard = () => {
  return (
    <Layout role="seller">
      <div>
        <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
        <p>Manage your products and orders here.</p>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
