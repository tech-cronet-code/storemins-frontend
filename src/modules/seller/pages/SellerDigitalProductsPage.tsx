import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerDigitalProductsContainer from "../containers/SellerDigitalProductsContainer";

const SellerDigitalProductsPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerDigitalProductsContainer />
      </Layout>
    </>
  );
};

export default SellerDigitalProductsPage;
