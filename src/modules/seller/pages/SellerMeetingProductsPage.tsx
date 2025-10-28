import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import SellerMeetingProductsContainer from "../containers/SellerMeetingProductsContainer";

const SellerMeetingProductsPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <SellerMeetingProductsContainer />
      </Layout>
    </>
  );
};

export default SellerMeetingProductsPage;
