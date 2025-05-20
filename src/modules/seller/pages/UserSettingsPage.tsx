import { useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import Layout from "../../dashboard/components/Layout";
import UserSettingsContainer from "../containers/UserSettingsContainer";
import { AlertTriangle, X } from "lucide-react";

const UserSettingsPage = () => {
  const [showAlert, setShowAlert] = useState(true); // ✅ alert visibility

  return (
    <Layout role={UserRoleName.SELLER}>
      <div className="max-w-6xl mx-auto w-full px-4">
        {showAlert && (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 text-orange-800 text-sm px-4 py-3 rounded-md mb-4 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-400" />
              <span>
                Example is under maintenance, some stats might not be available.
                Please use Google Analytics plugin for analytics data.
              </span>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-orange-500 hover:text-orange-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <UserSettingsContainer />
      </div>
    </Layout>
  );
};

export default UserSettingsPage;
