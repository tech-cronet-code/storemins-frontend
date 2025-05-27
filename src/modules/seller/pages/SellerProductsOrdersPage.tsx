import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerProductsOrdersContainer from "../containers/SellerProductsOrdersContainer";

const SellerProductsOrdersPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerProductsOrdersContainer/>
      </Layout>
    </>
  );
};

export default SellerProductsOrdersPage;
