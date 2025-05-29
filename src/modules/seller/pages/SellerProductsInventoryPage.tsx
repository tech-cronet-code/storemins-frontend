import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerProductsInventoryContainer from "../containers/SellerProductsInventoryContainer";

const SellerProductsInventoryPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerProductsInventoryContainer />
      </Layout>
    </>
  );
};

export default SellerProductsInventoryPage;
