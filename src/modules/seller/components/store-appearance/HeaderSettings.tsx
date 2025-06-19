// HeaderSettings.tsx
import React from "react";

interface HeaderSettingsProps {
  headerSettings: any;
  onChange: (data: any) => void;
}

const HeaderSettings: React.FC<HeaderSettingsProps> = ({
  headerSettings,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="font-medium">Announcement Bar</label>
        <input
          type="checkbox"
          checked={headerSettings.showAnnouncement}
          onChange={(e) =>
            onChange({ ...headerSettings, showAnnouncement: e.target.checked })
          }
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Announcement Message</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={headerSettings.message}
          onChange={(e) =>
            onChange({ ...headerSettings, message: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Bar Color</label>
        <input
          type="color"
          value={headerSettings.barColor}
          onChange={(e) =>
            onChange({ ...headerSettings, barColor: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Font Color</label>
        <input
          type="color"
          value={headerSettings.fontColor}
          onChange={(e) =>
            onChange({ ...headerSettings, fontColor: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default HeaderSettings;
