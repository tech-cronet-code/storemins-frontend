import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../components/CustomerLayout";

const CustomerDashboard = () => {
  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div>
        <h1>This is Dashboard Page of Customer </h1>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
