import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import AddCategoriesContainer from "../containers/AddCategoriesContainer";
import { useParams, useSearchParams } from "react-router-dom";

const AddCategoriesPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || undefined; // ✅ Fix null to undefined

  console.log({ id, type });

  return (
    <Layout role={UserRoleName.SELLER}>
      <AddCategoriesContainer categoryId={id} type={type} />
    </Layout>
  );
};

export default AddCategoriesPage;
