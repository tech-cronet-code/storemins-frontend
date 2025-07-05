// src/utils/buildStoreUrl.ts

export type DomainType = "SUBDOMAIN" | "CUSTOM";

export interface DomainLike {
  domain?: string | null;
  domainType?: DomainType | null;
  suggestedDomain?: string | null;
}

/** Generate temporary random readable string like: sparkle-shop-94 */
const getRandomSlug = () => {
  const words = ["sparkle", "quick", "neon", "astro", "crimson", "nova", "metro", "swift"];
  const suffix = Math.floor(Math.random() * 100);
  const pick = words[Math.floor(Math.random() * words.length)];
  return `${pick}-shop-${suffix}`;
};

/** Final display domain (includes .storemins.com if SUBDOMAIN) */
export const getSuggestedDomain = (domainObj?: DomainLike): string => {
  if (!domainObj) return getRandomSlug() + ".storemins.com";

  const raw = domainObj.domain || domainObj.suggestedDomain || getRandomSlug();

  return domainObj.domainType === "SUBDOMAIN"
    ? `storemins.com/${raw}` // ✅ changed here
    : raw;
};


/** Final working URL */
export const buildStoreUrl = (domainObj?: DomainLike): string => {
  if (!domainObj?.domain) return "";

  return domainObj.domainType === "SUBDOMAIN"
    ? `https://storemins.com/${domainObj.domain}` // ✅ changed here
    : `https://${domainObj.domain}`;
};

