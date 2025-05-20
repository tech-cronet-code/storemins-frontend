interface Props {
  tabs: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
}

const SettingsTabNav: React.FC<Props> = ({ tabs, activeKey, onChange }) => {
  return (
    <div className="flex space-x-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-2 text-sm font-medium ${
            tab.key === activeKey
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabNav;
