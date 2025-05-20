import { useState } from "react";
import PreferencesForm from "../components/PreferencesForm";
import SecurityForm from "../components/SecurityForm";
import SettingsTabNav from "../components/SettingsTabNav";
import UserSettingsForm from "../components/UserSettingsForm";
// import PreferencesForm from "../components/PreferencesForm";

const TAB_CONFIG = [
  {
    key: "edit-profile",
    label: "Edit Profile",
    component: <UserSettingsForm />,
  },
  { key: "preferences", label: "Preferences", component: <PreferencesForm /> }, // ✅ add this

  {
    key: "security",
    label: "Security",
    component: <SecurityForm />,
  },
];

const UserSettingsContainer = () => {
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].key);
  const currentTab = TAB_CONFIG.find((t) => t.key === activeTab);

  return (
    <>
      <SettingsTabNav
        tabs={TAB_CONFIG.map(({ key, label }) => ({ key, label }))}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
      <div className="mt-6 bg-white shadow-md rounded-xl p-6">
        {currentTab?.component}
      </div>
    </>
  );
};

export default UserSettingsContainer;
