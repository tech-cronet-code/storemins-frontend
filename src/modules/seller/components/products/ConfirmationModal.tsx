import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  isOpen,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    // BACKDROP that closes modal on click
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel} // closing on click outside
    >
      {/* MODAL CONTENT - stops bubbling to backdrop */}
      <div
        className="bg-white rounded-md p-6 shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // prevents backdrop click
      >
        {title && (
          <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
        )}
        <p
          className="text-sm text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
