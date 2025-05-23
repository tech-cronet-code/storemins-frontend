import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface UpgradeToBusinessPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlans: () => void;
}

const UpgradeToBusinessPlanModal = ({
  isOpen,
  onClose,
  onViewPlans,
}: UpgradeToBusinessPlanModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {/* Transparent black backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10">
        <div className="p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Heading */}
          <div className="text-center">
            <div className="text-3xl mb-2">💎✨</div>
            <h2 className="text-lg font-bold text-gray-900">
              Upgrade to Business Plan
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              View the list of carts that have been left out by the customers as
              abandoned
            </p>
          </div>

          {/* Features List */}
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>All Features From Professional Plan</li>
            <li>Upto 100000 Products</li>
            <li>Free Domain (.in, .co.in etc.)</li>
            <li>Upto 25 Staff Members</li>
            <li>App Publishing</li>
            <li>Dedicated Support Manager</li>
          </ul>

          {/* Actions */}
          <div className="mt-6 flex justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50"
            >
              Close
            </button>
            <button
              onClick={onViewPlans}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpgradeToBusinessPlanModal;
