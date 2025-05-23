import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerProductsContainer from "../containers/SellerProductsContainer";

const SellerProductsPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerProductsContainer />
      </Layout>
    </>
  );
};

export default SellerProductsPage;
