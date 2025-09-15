import React from "react";
import { AnnouncementBarBlock, AnnBarSettings } from "./announcementBar";

/** Backend DTO shape coming from your API */
export type StorefrontLayoutItemDto = {
  id: string;
  code: string; // e.g. "announcement_bar", "hero_banner", etc.
  settings?: unknown; // block-specific payload
  position?: number; // for ordering
};

type BlockDef<TSettings = unknown> = {
  Component: React.ComponentType<{ settings?: TSettings }>;
};

/** Registry of known blocks (can safely grow over time) */
// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-explicit-any
export const BlockRegistry: Record<string, BlockDef<any>> = {
  announcement_bar: { Component: AnnouncementBarBlock },
  // add more blocks here as you build them, e.g.
  // hero_banner: { Component: HeroBannerBlock },
};

/** Renders layout from DTOs without over-narrowing generics */
export function RenderLayout({
  layout,
}: {
  layout: StorefrontLayoutItemDto[];
}) {
  const sorted = [...(layout || [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  return (
    <>
      {sorted.map((b) => {
        const def = BlockRegistry[b.code];
        if (!def) return null;

        // Narrow types for known blocks to get prop safety
        if (b.code === "announcement_bar") {
          const Comp = def.Component as React.ComponentType<{
            settings?: Partial<AnnBarSettings>;
          }>;
          return (
            <Comp key={b.id} settings={b.settings as Partial<AnnBarSettings>} />
          );
        }

        // Fallback for unknown/other blocks
        const Comp = def.Component;
        return <Comp key={b.id} settings={b.settings} />;
      })}
    </>
  );
}
