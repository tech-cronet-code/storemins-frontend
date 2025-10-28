// shared/blocks/topNav.tsx
import cn from "classnames";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../modules/customer/context/CustomerAuthContext";
import CustomerLoginModal from "./CustomerLoginModal";

/* ============================== Types ============================== */
export type TopNavSettings = {
  background_color?: string;
  text_color?: string;
  border?: boolean;
  logo_placement?: "left" | "center";
  logo_type?: "default" | "white" | "none" | "custom";
  logo_url?: string;
  brand_subtitle?: string;
  show_search?: boolean;
  show_cart?: boolean;
  show_wishlist?: boolean;
  show_whatsapp?: boolean;
  show_profile?: boolean;
  whatsapp_number?: string;
  left_button?: "NONE" | "BRANCH" | "SEARCH" | "ACCOUNT" | "CART" | "MENU";
  right_button?: "NONE" | "BRANCH" | "SEARCH" | "ACCOUNT" | "CART" | "MENU";
  menu_items?: Array<{ label?: string; href?: string }>;
  display_categories_on_menu?: boolean;
  sticky_header?: boolean;
  visibility?: "all" | "desktop" | "mobile";
  desktop_search_bar_background_color?: string;
  desktop_search_bar_placeholder_text?: string;
  desktop_search_bar_placeholder_text_color?: string;
  desktop_search_bar_display_search_icon?: boolean;
  desktop_search_bar_border?: boolean;
  desktop_search_bar_border_size?:
    | "0px"
    | "1px"
    | "2px"
    | "3px"
    | "4px"
    | "6px";
  desktop_search_bar_border_color?: string;
  desktop_search_bar_radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  custom_css?: string | null;
  icon_size_sm?: number | string;
  icon_size_md?: number | string;
  icon_size_lg?: number | string;
  /** Force show Menu regardless of left_button */
  forceMenu?: boolean;
  /** Hide Menu on /p/:productSlug routes (ignored when forceMenu=true) */
  hideMenuOnDetail?: boolean;
};

/* ============================== Utils / hooks ============================== */
const radiusClass: Record<
  NonNullable<TopNavSettings["desktop_search_bar_radius"]>,
  string
> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

function visibilityClass(v?: TopNavSettings["visibility"]) {
  switch (v) {
    case "desktop":
      return "hidden md:block";
    case "mobile":
      return "block md:hidden";
    default:
      return "";
  }
}

function useIsMdUp() {
  const [mdUp, setMdUp] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setMdUp(e.matches);
    setMdUp(mq.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener?.(onChange);
    return () => {
      mq.removeListener?.(onChange);
    };
  }, []);
  return mdUp;
}

function useIsEditorPage() {
  const [isEditor, setIsEditor] = useState(false);
  useEffect(() => {
    try {
      const p = window.location.pathname || "";
      const q = window.location.search || "";
      setIsEditor(
        /(^|\/)(editor|admin)(\/|$)/i.test(p) ||
          /[?&](editor|preview)=1\b/i.test(q)
      );
    } catch {
      setIsEditor(false);
    }
  }, []);
  return isEditor;
}

function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/** Get current store slug from the URL: first non-empty path segment */
function getCurrentStoreSlug(): string | null {
  try {
    const parts = (window.location.pathname || "/").split("/").filter(Boolean);
    return parts.length ? parts[0] : null;
  } catch {
    return null;
  }
}

/** Prefix a path with the current slug when present; otherwise return the clean path */
function withSlug(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const slug = getCurrentStoreSlug();
  if (!slug) return clean;
  return `/${slug}${clean}`;
}

/** Read first defined localStorage key */
function getFirstLS(keys: string[]): string | null {
  if (typeof window === "undefined") return null;
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

/* ============================== Icons ============================== */
const Svg: React.FC<
  React.PropsWithChildren<{ size?: number; className?: string }>
> = ({ size = 22, className, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

const Icon = {
  menu: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <path
        d="M3 6h18M3 12h18M3 18h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  search: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  back: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  close: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <path
        d="M6 6l12 12M18 6l-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  whatsapp: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <path
        fill="currentColor"
        d="M20 3.9A10 10 0 0 0 3.9 20L3 21l3.1-.8A10 10 0 1 0 20 3.9Zm-8 1.9a7.1 7.1 0 0 1 5.1 12.2c-.9.8-2 .1-2.9-.3-2.2-.9-3.6-1.9-5-3.8-1.4-1.9-1.7-3.5-1.1-4.1.5-.6 1.2-1.5 1.9-1.3.7.1.9 1.4 1 1.7.1.4-.2.6-.4.8-.3.2-.6.5-.3 1.1.3.6 1.2 1.9 2.6 2.7.5.3.9.4 1.2.1.3-.2.9-.9 1.3-.8.3 0 .9.3 1.2.5.3.2.5.3.6.5.1.3-.1 1.1-.7 1.6-.7.6-1.6.7-2.6.5A7.1 7.1 0 0 1 12 5.8Z"
      />
    </Svg>
  ),
  bagHeart: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="9"
        width="16"
        height="11"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 14c1.4-2 5-1.2 5 1.1 0 2-2.8 3.5-5 5.4-2.2-1.9-5-3.4-5-5.4C7 12.8 10.6 12 12 14z"
        fill="currentColor"
      />
    </Svg>
  ),
  user: (p: { size?: number; className?: string }) => (
    <Svg {...p}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" opacity=".3" />
    </Svg>
  ),
};

/* ============================== Small UI bits ============================== */
const IconTap: React.FC<{
  label: string;
  onClick?: () => void;
  color?: string;
  children: React.ReactNode;
}> = ({ label, onClick, color, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center px-1.5 md:px-2"
    style={{ color }}
    aria-label={label}
  >
    <div className="h-8 md:h-9 flex items-center">{children}</div>
    <span className="mt-0.5 text-[10px] md:text-[11px] leading-none md:hidden opacity-80">
      {label}
    </span>
  </button>
);

const PillSearchButton: React.FC<{ s: TopNavSettings; onOpen: () => void }> = ({
  s,
  onOpen,
}) => {
  const bg = s.desktop_search_bar_background_color || "#ffffff";
  const ph = s.desktop_search_bar_placeholder_text_color || "#6b7280";
  const radius = s.desktop_search_bar_radius || "full";
  const showIcon = s.desktop_search_bar_display_search_icon !== false;

  return (
    <button
      type="button"
      aria-label="Open search"
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={cn(
        "hidden md:flex w-[34rem] max-w-[42vw] items-center px-4 py-2 cursor-text",
        "border border-slate-200/60 bg-white shadow-sm hover:border-slate-300 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-slate-200/80 transition-all duration-200 ease-in-out",
        radiusClass[radius]
      )}
      style={{ backgroundColor: bg, color: ph }}
    >
      {showIcon && (
        <span className="mr-2 text-slate-400 flex items-center">
          <Icon.search size={18} />
        </span>
      )}
      <span className="w-full text-left text-sm text-slate-500 truncate">
        {s.desktop_search_bar_placeholder_text || "Search products"}
      </span>
    </button>
  );
};

/* ============================== Overlays (Search / Drawer) ============================== */
const SearchDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  placeholder?: string;
}> = ({ open, onClose, placeholder }) => {
  useLockBodyScroll(open);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-3 sm:p-4 md:p-8"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-5 right-0 sm:-top-6 sm:-right-6 h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center"
        >
          <Icon.close size={18} />
        </button>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 md:px-3 py-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="p-1 rounded hover:bg-slate-100 text-slate-700"
            >
              <Icon.back size={18} />
            </button>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
              placeholder={placeholder || "Search for categories or products"}
            />
            <span className="text-slate-600 opacity-80">
              <Icon.search size={20} />
            </span>
          </div>
          <div className="min-h-[55vh]" />
        </div>
      </div>
    </div>
  );
};

const Drawer: React.FC<
  React.PropsWithChildren<{
    title?: string;
    open: boolean;
    onClose: () => void;
  }>
> = ({ title = "Menu", open, onClose, children }) => {
  useLockBodyScroll(open);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <aside
        className="absolute left-0 top-0 h-full w-[92vw] sm:w-[85vw] max-w-sm bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="font-semibold text-sm sm:text-base">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"
            aria-label="Close"
          >
            <Icon.close size={18} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
};

/* ============================== Component ============================== */
export const TopNavBlock: React.FC<{ settings?: Partial<TopNavSettings> }> = ({
  settings,
}) => {
  const s: TopNavSettings = settings || {};
  const mdUp = useIsMdUp();
  const isEditor = useIsEditorPage();
  const navigate = useNavigate();

  // ---- AUTH
  const auth = useCustomerAuth();
  const tokenFromLS =
    getFirstLS([
      "customer_auth_token",
      "customer_auth_user",
      "access_token",
      "token",
    ]) || "";
  const isLoggedIn = Boolean(auth?.user?.id || tokenFromLS);

  const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => {
    if (authOpen && isLoggedIn) {
      setAuthOpen(false);
      navigate(withSlug("/profile"));
    }
  }, [authOpen, isLoggedIn, navigate]);

  const sizes = useMemo(() => {
    const sm = Number(s.icon_size_sm ?? 18) || 18;
    const md = Number(s.icon_size_md ?? 22) || 22;
    const lg = Number(s.icon_size_lg ?? 24) || 24;
    return { sm, md, lg };
  }, [s.icon_size_sm, s.icon_size_md, s.icon_size_lg]);

  const iconSize = mdUp ? sizes.md : sizes.sm;
  const bigIconSize = mdUp ? sizes.lg : sizes.md;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const showOnMobile = s.visibility !== "desktop";
  const showOnDesktop = s.visibility !== "mobile";

  const desktopStickyOn = !!s.sticky_header;
  const desktopFixedOn = desktopStickyOn && isEditor;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerH, setHeaderH] = useState(0);
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const measure = () => setHeaderH(el.getBoundingClientRect().height || 0);
    measure();
    const ro = new (window as any).ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const waHref = (() => {
    const raw = (s.whatsapp_number || "").trim();
    if (!raw) return "https://wa.me/";
    if (/^https?:\/\//i.test(raw)) return raw;
    const digits = raw.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : "https://wa.me/";
  })();

  const textColor = s.text_color || "#111827";
  const showSearch = s.show_search !== false;
  const showCart = s.show_cart !== false;
  const showWishlist = s.show_wishlist !== false;
  const showWhatsApp = s.show_whatsapp !== false;
  const showProfile = s.show_profile !== false;

  // ---------- effective button logic ----------
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const onProductDetail = /(^|\/)p(\/|$)/.test(pathname);

  const effectiveLeft: NonNullable<TopNavSettings["left_button"]> =
    useMemo(() => {
      if (s.forceMenu) return "MENU";
      if (s.hideMenuOnDetail && onProductDetail) return "NONE";
      return s.left_button ?? "MENU";
    }, [s.forceMenu, s.hideMenuOnDetail, s.left_button, onProductDetail]);

  const effectiveRight: NonNullable<TopNavSettings["right_button"]> =
    s.right_button ?? "NONE";

  // ---- positioning classes
  const classes = cn(
    "w-full",
    visibilityClass(s.visibility),
    // fixed on mobile, sticky/fixed on desktop depending on settings/editor
    "fixed top-0 left-0 right-0 z-[200] md:static md:top-auto md:left-auto md:right-auto md:z-auto",
    desktopStickyOn && !desktopFixedOn && "md:sticky md:top-0 md:z-[200]",
    desktopFixedOn && "md:fixed md:top-0 md:left-0 md:right-0 md:z-[200]"
  );

  const rowClass = isEditor
    ? "mx-auto max-w-6xl px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3"
    : "w-full max-w-none px-2.5 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center gap-2 md:gap-3";

  const openSearch = () => setSearchOpen(true);

  // --- IMPORTANT: clamp top to 0 while scrolling so header is flush to top
  const [dynamicTop, setDynamicTop] = useState<string>(
    "var(--annbar-offset, 0px)"
  );
  useEffect(() => {
    const readVar = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--annbar-offset")
        .trim() || "0px";

    const update = () => {
      const scrolled = (window.scrollY || window.pageYOffset || 0) > 1;
      setDynamicTop(scrolled ? "0px" : `var(--annbar-offset, ${readVar()})`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const id = window.setInterval(update, 500); // defensive in case the var changes
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearInterval(id);
    };
  }, []);

  const isMobile = !mdUp;
  const needsAnnounceOffset =
    isMobile || (mdUp && (desktopStickyOn || desktopFixedOn));

  return (
    <>
      <header
        ref={headerRef}
        className={classes}
        style={{
          backgroundColor: s.background_color || "#ffffff",
          top: needsAnnounceOffset ? dynamicTop : undefined,
        }}
      >
        <div className={rowClass}>
          {/* Left button */}
          <div className="w-12 sm:w-16 md:w-24">
            {effectiveLeft !== "NONE" && (
              <button
                type="button"
                onClick={() => {
                  if (effectiveLeft === "MENU") setMenuOpen(true);
                  if (effectiveLeft === "SEARCH") openSearch();
                }}
                className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm px-2 py-1 rounded-md hover:bg-slate-100"
                style={{ color: textColor }}
                aria-label={effectiveLeft === "MENU" ? "Menu" : "Search"}
              >
                {effectiveLeft === "MENU" ? (
                  <Icon.menu size={iconSize} />
                ) : effectiveLeft === "SEARCH" ? (
                  <Icon.search size={iconSize} />
                ) : null}
                <span className="hidden sm:inline opacity-80">
                  {effectiveLeft[0] + effectiveLeft.slice(1).toLowerCase()}
                </span>
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-0" />

          {/* Desktop search pill */}
          {showSearch && <PillSearchButton s={s} onOpen={openSearch} />}

          {/* Right icons */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {showSearch && !mdUp && (
              <IconTap color={textColor} label="Search" onClick={openSearch}>
                <Icon.search size={iconSize} />
              </IconTap>
            )}

            {(showCart || showWishlist) && (
              <IconTap
                color={textColor}
                label="Cart/Wishlist"
                onClick={() => {
                  window.location.href = withSlug("/checkout");
                }}
              >
                <Icon.bagHeart size={bigIconSize} />
              </IconTap>
            )}

            {showWhatsApp && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="no-underline"
              >
                <IconTap color={textColor} label="WhatsApp">
                  <Icon.whatsapp size={iconSize} />
                </IconTap>
              </a>
            )}

            {showProfile && (
              <IconTap
                color={textColor}
                label="Profile"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(withSlug("/profile"));
                  } else {
                    setAuthOpen(true);
                  }
                }}
              >
                <Icon.user size={iconSize} />
              </IconTap>
            )}

            {effectiveRight !== "NONE" && (
              <IconTap
                color={textColor}
                label={
                  effectiveRight[0] + effectiveRight.slice(1).toLowerCase()
                }
                onClick={() => {
                  if (effectiveRight === "MENU") setMenuOpen(true);
                  if (effectiveRight === "SEARCH") openSearch();
                }}
              >
                {effectiveRight === "MENU" ? (
                  <Icon.menu size={iconSize} />
                ) : effectiveRight === "SEARCH" ? (
                  <Icon.search size={iconSize} />
                ) : null}
              </IconTap>
            )}
          </div>
        </div>
      </header>

      {/* Spacers for fixed header */}
      {showOnMobile && (
        <div
          className="block md:hidden"
          style={{ height: headerH }}
          aria-hidden
        />
      )}
      {showOnDesktop && desktopFixedOn && (
        <div
          className="hidden md:block"
          style={{ height: headerH }}
          aria-hidden
        />
      )}

      {/* Menu drawer */}
      <Drawer title="Menu" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav className="p-2 space-y-1 text-sm">
          {Array.isArray(s.menu_items) &&
            s.menu_items.map((it, i) => (
              <a
                key={i}
                href={it?.href || "#"}
                className="block rounded px-3 py-2 hover:bg-slate-50"
              >
                {it?.label || "Link"}
              </a>
            ))}

          {s.display_categories_on_menu && (
            <div className="mt-3 border-t pt-3">
              <div className="px-3 py-2 font-semibold text-slate-700">
                Categories
              </div>
              <div className="px-3 py-2 text-slate-500">…</div>
            </div>
          )}
        </nav>
      </Drawer>

      {/* Search dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder={s.desktop_search_bar_placeholder_text || "Search products"}
      />

      {/* Auth modal */}
      <CustomerLoginModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </>
  );
};

/* ============================== Mapping helpers ============================== */
// eslint-disable-next-line react-refresh/only-export-components
export function mapTopNavToUI(s?: Partial<TopNavSettings>) {
  const v = s || {};
  return {
    backgroundColor: v.background_color ?? "#ffffff",
    textColor: v.text_color ?? "#111827",
    sticky: !!v.sticky_header,
    showSearch: v.show_search !== false,
    showCart: v.show_cart !== false,
    showWishlist: v.show_wishlist !== false,
    showWhatsApp: v.show_whatsapp !== false,
    showProfile: v.show_profile !== false,
    whatsappNumber: v.whatsapp_number ?? "",
    leftButton: (v.left_button ?? "MENU") as NonNullable<
      TopNavSettings["left_button"]
    >,
    rightButton: (v.right_button ?? "NONE") as NonNullable<
      TopNavSettings["right_button"]
    >,
    placeholder: v.desktop_search_bar_placeholder_text ?? "Search products",
    searchBg: v.desktop_search_bar_background_color ?? "#ffffff",
    searchPhColor: v.desktop_search_bar_placeholder_text_color ?? "#6b7280",
    searchShowIcon: v.desktop_search_bar_display_search_icon !== false,
    radius: (v.desktop_search_bar_radius ?? "full") as NonNullable<
      TopNavSettings["desktop_search_bar_radius"]
    >,
    menuItems: Array.isArray(v.menu_items) ? v.menu_items : [],
    visibility: (v.visibility ?? "all") as NonNullable<
      TopNavSettings["visibility"]
    >,
    border: v.desktop_search_bar_border ?? true,
    borderSize: (v.desktop_search_bar_border_size ?? "1px") as NonNullable<
      TopNavSettings["desktop_search_bar_border_size"]
    >,
    borderColor: v.desktop_search_bar_border_color ?? "#111827",
    forceMenu: !!v.forceMenu,
    hideMenuOnDetail: !!v.hideMenuOnDetail,
    customCss: v.custom_css ?? "",
    iconSizeSm: v.icon_size_sm ?? 18,
    iconSizeMd: v.icon_size_md ?? 22,
    iconSizeLg: v.icon_size_lg ?? 24,
  };
}

export function mergeTopNavFromUI(
  existing: Partial<TopNavSettings> | undefined,
  ui: ReturnType<typeof mapTopNavToUI>
): TopNavSettings {
  return {
    ...(existing || {}),
    background_color: ui.backgroundColor,
    text_color: ui.textColor,
    sticky_header: !!ui.sticky,
    show_search: !!ui.showSearch,
    show_cart: !!ui.showCart,
    show_wishlist: !!ui.showWishlist,
    show_whatsapp: !!ui.showWhatsApp,
    show_profile: !!ui.showProfile,
    whatsapp_number: ui.whatsappNumber || "",
    left_button: ui.leftButton,
    right_button: ui.rightButton,
    desktop_search_bar_placeholder_text: ui.placeholder,
    desktop_search_bar_background_color: ui.searchBg,
    desktop_search_bar_placeholder_text_color: ui.searchPhColor,
    desktop_search_bar_display_search_icon: !!ui.searchShowIcon,
    desktop_search_bar_radius: ui.radius,
    visibility: ui.visibility,
    desktop_search_bar_border: !!ui.border,
    desktop_search_bar_border_size: ui.borderSize,
    desktop_search_bar_border_color: ui.borderColor,
    menu_items: Array.isArray(ui.menuItems) ? ui.menuItems : [],
    forceMenu: !!ui.forceMenu,
    hideMenuOnDetail: !!ui.hideMenuOnDetail,
  };
}
