import React from "react";


const FeatureUpdateCardWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative bg-[#16163F] rounded-xl p-5 text-white h-[220px] w-full overflow-hidden">
      {children}
    </div>
  );
};

export default FeatureUpdateCardWrapper;
