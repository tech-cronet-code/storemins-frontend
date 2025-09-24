import React from "react";
import SocialProofStrip from "./SocialProofStrip";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocialProofStripBlock: React.FC<{ settings?: any }> = ({
  settings,
}) => <SocialProofStrip settings={settings} />;

export default SocialProofStripBlock;
