import React from "react";
import MainCoupon from "./MainCoupon";

export const MainCouponBlock: React.FC<{ settings?: any }> = ({ settings }) => {
  return <MainCoupon settings={settings || {}} />;
};

export default MainCouponBlock;
