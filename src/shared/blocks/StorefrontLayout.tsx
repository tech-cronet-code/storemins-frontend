import React from "react";
import cn from "classnames";
import { TopNavBlock, type TopNavSettings } from "./topNav";
import BottomNav from "./BottomNav";
import { useAuth } from "../../modules/auth/contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  /** Pass settings for the header (TopNavBlock). */
  headerSettings?: Partial<TopNavSettings>;
  /** Pass settings for the footer (BottomNav). */
  footerSettings?: any;
  /** Optional override; falls back to AuthContext businessId. */
  businessId?: string;
  /** Extra class(es) on the outer wrapper. */
  className?: string;
};

/**
 * Generic storefront layout with Header (TopNavBlock) and Footer (BottomNav).
 * Use it to wrap any public page (home, PDPs, collections, etc).
 */
const StorefrontLayout: React.FC<Props> = ({
  children,
  headerSettings,
  footerSettings,
  businessId: businessIdProp,
  className,
}) => {
  // fallback businessId from auth if not provided
  type AuthDetails = { storeLinks?: Array<{ businessId?: string | null }> };
  type AuthCtx = { userDetails?: AuthDetails };
  const { userDetails } = (useAuth() as AuthCtx) ?? {};
  const businessId =
    businessIdProp ?? userDetails?.storeLinks?.[0]?.businessId?.trim?.() ?? "";

  return (
    <div className={cn("min-h-dvh flex flex-col bg-[#fafafa]", className)}>
      {/* Header */}
      <TopNavBlock settings={headerSettings || {}} />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <BottomNav settings={footerSettings || {}} businessId={businessId} />
    </div>
  );
};

export default StorefrontLayout;
