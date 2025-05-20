import React from "react";

interface ShortcutCardProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isAddCard?: boolean;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({
  label,
  icon,
  onClick,
  isAddCard,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group border border-dashed ${
        isAddCard
          ? "border-gray-300 hover:border-blue-400"
          : "border-gray-200 hover:border-blue-400"
      } rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
        isAddCard
          ? "flex items-center justify-center px-6 py-6"
          : "flex items-center gap-4 px-5 py-4"
      }`}
    >
      {isAddCard ? (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-blue-600">
            <span className="text-xl leading-none">＋</span>
            <span>Add new shortcut</span>
          </div>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition truncate w-full">
            {label}
          </span>
        </>
      )}
    </div>
  );
};

export default ShortcutCard;
