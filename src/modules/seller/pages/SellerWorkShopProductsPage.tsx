import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerWorkShopProductsContainer from "../containers/SellerWorkShopProductsContainer";

const SellerWorkShopProductsPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerWorkShopProductsContainer/>
      </Layout>
    </>
  );
};

export default SellerWorkShopProductsPage;
