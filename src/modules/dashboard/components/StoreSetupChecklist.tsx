import React from "react";
import { CheckCircle, Pencil } from "lucide-react";

const StoreSetupChecklist: React.FC = () => {
  const checklistData = [
    {
      title: "Upload Store Logo",
      subtitle:
        "You must upload your store logo. This will make your store good looking and authentic. You must upload your store logo. This will make your store good looking and authentic.",
      flag: false,
    },
    {
      title: "Add products",
      subtitle: "Add products in your store to start selling.",
      flag: true,
    },
    {
      title: "Add coupon and grow sales",
      subtitle: "Create a new coupon and share with your customers.",
      flag: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full h-full flex flex-col">
      {/* Scrollable content with visible custom scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600 scrollbar-track-gray-200 pr-1">
        <ul className="space-y-3">
          {checklistData.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-start gap-3 hover:bg-gray-50 px-3 py-3 rounded-lg transition-all group"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  <div
                    className={`rounded-full p-1 shadow-sm ${
                      item.flag
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-sm">
                  <p
                    className={`font-medium ${
                      item.flag ? "text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <button
                title="Edit"
                className="p-1 rounded-full border border-transparent hover:border-blue-100 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-200"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StoreSetupChecklist;
