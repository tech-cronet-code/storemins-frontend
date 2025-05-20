import React from "react";

interface GetMoreCardProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  customButton?: React.ReactNode;
}

const GetMoreCard: React.FC<GetMoreCardProps> = ({
  title,
  subtitle,
  buttonText,
  icon,
  bgColor = "bg-white",
  customButton,
}) => {
  return (
    <div
      className={`flex items-center justify-between ${bgColor} rounded-xl px-4 py-4 shadow-sm border border-gray-100`}
    >
      {/* Left: Icon + Text */}
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 leading-snug mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Right: Button */}
      {customButton ? (
        <div>{customButton}</div>
      ) : (
        <button className="text-[13px] font-semibold text-orange-500 bg-orange-100 px-4 py-1 rounded-full hover:bg-orange-200 transition-colors duration-200">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default GetMoreCard;
