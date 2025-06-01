import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import AddCategoriesContainer from "../containers/AddCategoriesContainer";

const AddCategoriesPage = () => {
  return (
    <>
      <Layout role={UserRoleName.SELLER}>
        <AddCategoriesContainer />
      </Layout>
    </>
  );
};

export default AddCategoriesPage;
