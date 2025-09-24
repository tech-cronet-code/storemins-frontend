import React from "react";
import { AnnouncementBarBlock } from "./announcementBar";
import { TopNavBlock } from "./topNav";
import { StoreHeroBlock } from "./storeHero";
import { StoreStatsBlock } from "./storeStats";
import { StoreDeliveryInfoBlock } from "./storeDeliveryInfo";
import { FlashSaleHeroBlock } from "./flashSaleHero";
import { SocialProofStripBlock } from "./socialProofStripBlock";
import { MainCouponBlock } from "./mainCouponBlock"; // ← NEW
import OffersCollections from "./OffersCollections";

type Block = {
  id?: string;
  code: string;
  position?: number;
  is_active?: number;
  settings?: any;
};

export const OffersCollectionsBlock: React.FC<{ settings?: any }> = ({
  settings,
}) => <OffersCollections settings={settings || {}} />;

type BlockEntry = {
  Component: React.ComponentType<{ settings?: any }>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const BlockRegistry: Record<string, BlockEntry> = {
  announcement_bar: { Component: AnnouncementBarBlock },
  top_nav: { Component: TopNavBlock },
  store_hero: { Component: StoreHeroBlock },
  flash_sale_hero: { Component: FlashSaleHeroBlock },
  store_stats: { Component: StoreStatsBlock },
  social_proof_strip: { Component: SocialProofStripBlock },
  offers_collections: { Component: OffersCollectionsBlock }, // NEW
  main_coupon: { Component: MainCouponBlock }, // ← NEW
  store_delivery_info: { Component: StoreDeliveryInfoBlock },
};

export const RenderBlock: React.FC<{ block: Block }> = ({ block }) => {
  const entry = BlockRegistry[block.code];
  if (!entry) return null;
  const Cmp = entry.Component;
  if (block.is_active === 0) return null;
  return <Cmp settings={block.settings} />;
};

export const RenderLayout: React.FC<{ layout: Block[] }> = ({ layout }) => {
  const sorted = [...(layout || [])].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
  );
  return (
    <>
      {sorted.map((b) => (
        <RenderBlock key={b.id || `${b.code}-${b.position}`} block={b} />
      ))}
    </>
  );
};
