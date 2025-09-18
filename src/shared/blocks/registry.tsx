// shared/blocks/registry.tsx
import React from "react";
import { AnnouncementBarBlock } from "./announcementBar"; // existing in your project
import { TopNavBlock } from "./topNav"; // existing in your project
import { StoreHeroBlock } from "./storeHero";

type Block = {
  id?: string;
  code: string;
  position?: number;
  is_active?: number;
  settings?: any;
};

type BlockEntry = {
  Component: React.ComponentType<{ settings?: any }>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const BlockRegistry: Record<string, BlockEntry> = {
  announcement_bar: { Component: AnnouncementBarBlock },
  top_nav: { Component: TopNavBlock },
  store_hero: { Component: StoreHeroBlock },
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
