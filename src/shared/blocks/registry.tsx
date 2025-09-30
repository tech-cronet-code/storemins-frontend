import React from "react";

import { AnnouncementBarBlock } from "./announcementBar";
import { TopNavBlock } from "./topNav";
import { StoreHeroBlock } from "./storeHero";
import { StoreStatsBlock } from "./storeStats";
import { StoreDeliveryInfoBlock } from "./storeDeliveryInfo";
import { FlashSaleHeroBlock } from "./flashSaleHero";
import { SocialProofStripBlock } from "./socialProofStripBlock";
import { MainCouponBlock } from "./mainCouponBlock";
import OffersCollections from "./OffersCollections";
import ProductsInfiniteScroll from "./ProductsInfiniteScroll";
import CustomerTestimonials from "./CustomerTestimonials";
import AboutUsBlock from "./AboutUs";
import BottomNav from "./BottomNav";

/* ---------------- Types ---------------- */

export type Block = {
  id?: string;
  code: string;
  position?: number;
  is_active?: number;
  settings?: any;
};

type BlockEntry = {
  // Keep permissive, some blocks ignore businessId
  Component: React.ComponentType<any>;
};

/* -------------- Registry ---------------- */

export const OffersCollectionsBlock: React.FC<{ settings?: any }> = ({
  settings,
}) => <OffersCollections settings={settings || {}} />;

// eslint-disable-next-line react-refresh/only-export-components
export const BlockRegistry: Record<string, BlockEntry> = {
  announcement_bar: { Component: AnnouncementBarBlock },
  top_nav: { Component: TopNavBlock },
  store_hero: { Component: StoreHeroBlock },
  flash_sale_hero: { Component: FlashSaleHeroBlock },
  store_stats: { Component: StoreStatsBlock },
  social_proof_strip: { Component: SocialProofStripBlock },
  offers_collections: { Component: OffersCollectionsBlock },
  main_coupon: { Component: MainCouponBlock },
  store_delivery_info: { Component: StoreDeliveryInfoBlock },

  // ⬇⬇ blocks that need businessId for data hooks
  products_infinite_scroll: { Component: ProductsInfiniteScroll },

  // ⬇⬇ NEW
  customer_testimonials: { Component: CustomerTestimonials },
  about_us: { Component: AboutUsBlock },
  bottom_nav: { Component: BottomNav },
};

/* -------------- Renderers ---------------- */

export const RenderBlock: React.FC<{ block: Block; businessId?: string }> = ({
  block,
  businessId,
}) => {
  const entry = BlockRegistry[block.code];
  if (!entry) return null;
  if (block.is_active === 0) return null;

  const Cmp = entry.Component;
  return <Cmp settings={block.settings} businessId={businessId} />;
};

export const RenderLayout: React.FC<{
  layout: Block[];
  businessId?: string;
}> = ({ layout, businessId }) => {
  const sorted = [...(layout || [])].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
  );
  return (
    <>
      {sorted.map((b) => (
        <RenderBlock
          key={b.id || `${b.code}-${b.position}`}
          block={b}
          businessId={businessId}
        />
      ))}
    </>
  );
};
