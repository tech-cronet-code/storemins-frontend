/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useRef as useReactRef,
} from "react";
import { useNavigate } from "react-router-dom";
import CustomerLoginModal from "./CustomerLoginModal";
import { useCustomerAuth } from "../../modules/customer/context/CustomerAuthContext";

/* ---------------- BASE_URL + slug helpers (match TopNav) ---------------- */
const LS_SLUG_KEY = "last_store_slug";
const RESERVED_SEGMENTS = new Set([
  "profile",
  "checkout",
  "orders",
  "cart",
  "wishlist",
  "login",
  "register",
  "search",
  "category",
  "categories",
  "p",
  "c",
  "admin",
  "editor",
]);

function getBase() {
  return (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
}
function getCurrentSlug(): string | null {
  try {
    const base = getBase();
    let path = window.location.pathname || "/";
    if (base && path.startsWith(base)) path = path.slice(base.length);
    if (path.startsWith("/")) path = path.slice(1);
    const [first] = path.split("/").filter(Boolean);
    if (!first) return null;
    if (RESERVED_SEGMENTS.has(first.toLowerCase())) return null;
    return first || null;
  } catch {
    return null;
  }
}
function getPreferredSlug(): string | null {
  const cur = getCurrentSlug();
  if (cur) return cur;
  try {
    return (
      sessionStorage.getItem(LS_SLUG_KEY) ||
      localStorage.getItem(LS_SLUG_KEY) ||
      null
    );
  } catch {
    return null;
  }
}
function rememberSlug() {
  const s = getCurrentSlug();
  if (!s) return;
  try {
    sessionStorage.setItem(LS_SLUG_KEY, s);
    localStorage.setItem(LS_SLUG_KEY, s);
  } catch {
    /* empty */
  }
}
/** For hard reloads */
export function buildHref(path: string, slug?: string | null) {
  const base = getBase();
  const clean = (path || "").replace(/^\/+/, "");
  const s = slug ?? getPreferredSlug();
  return `${base}${s ? `/${s}` : ""}/${clean}`.replace(/\/+$/, "");
}
/** For react-router navigate() (NO BASE_URL) */
function buildRoute(path: string, slug?: string | null) {
  const clean = (path || "").replace(/^\/+/, "");
  const s = slug ?? getPreferredSlug();
  const parts = [s, clean].filter(Boolean).join("/");
  return `/${parts}`;
}
function isRouteActive(appRelative: string, slugAware = true) {
  const base = getBase();
  let cur = window.location.pathname || "/";
  if (base && cur.startsWith(base)) cur = cur.slice(base.length);
  if (!cur.startsWith("/")) cur = `/${cur}`;
  const s = slugAware ? getPreferredSlug() : null;
  const target = `/${[s, appRelative.replace(/^\/+/, "")]
    .filter(Boolean)
    .join("/")}`;
  return cur === target;
}
export function redirectToHomeWithSlug() {
  const base = getBase();
  const slug = getPreferredSlug();
  const href = `${base}${slug ? `/${slug}` : ""}/`;
  window.location.href = href;
}

/* ---------------- helpers ---------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setIsMobile(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, [breakpoint]);
  return isMobile;
}

function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const compute = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCount(cart.reduce((n: number, i: any) => n + (i?.qty || 1), 0));
      } catch {
        setCount(0);
      }
    };
    const rerun = () => compute();
    compute();
    window.addEventListener("cart:add", rerun as any);
    window.addEventListener("cart:update", rerun as any);
    window.addEventListener("cart:remove", rerun as any);
    window.addEventListener("cart:clear", rerun as any);
    window.addEventListener("storage", rerun as any);
    return () => {
      window.removeEventListener("cart:add", rerun as any);
      window.removeEventListener("cart:update", rerun as any);
      window.removeEventListener("cart:remove", rerun as any);
      window.removeEventListener("cart:clear", rerun as any);
      window.removeEventListener("storage", rerun as any);
    };
  }, []);
  return count;
}

/* ---------------- icons ---------------- */
function SvgIcon({
  id,
  className,
}: {
  id: "home" | "search" | "cart" | "account";
  className?: string;
}) {
  const stroke = {
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (id === "home")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...stroke} d="M3 10.5 12 3l9 7.5" />
        <path {...stroke} d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
        <path {...stroke} d="M9 21v-6h6v6" />
      </svg>
    );
  if (id === "search")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle {...stroke} cx="11" cy="11" r="7" />
        <path {...stroke} d="M20 20l-3.5-3.5" />
      </svg>
    );
  if (id === "cart")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          {...stroke}
          d="M3 4h2l2.2 10.4A2 2 0 0 0 9.2 16h6.9a2 2 0 0 0 2-1.6L20 8H6"
        />
        <circle cx="9.5" cy="20" r="1.6" fill="currentColor" />
        <circle cx="16.5" cy="20" r="1.6" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
      <path {...stroke} d="M3.5 21a8.5 8.5 0 0 1 17 0" />
    </svg>
  );
}

/* ---------------- desktop links panel ---------------- */
function LinksFooter({ s }: { s: any }) {
  const links = Array.isArray(s.desktop_footer_links)
    ? s.desktop_footer_links
    : [];
  const getLabel = (it: any) => it?.label ?? it?.title ?? "Link";
  const getHref = (it: any) => it?.href ?? it?.url ?? "#";

  return (
    <section
      className="w-full"
      style={{ background: s.desktop_footer_background_color }}
      aria-label="Desktop footer"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: s.desktop_footer_title_color }}
            >
              {s.desktop_footer_about_us_title || "About Us"}
            </h3>
            <p
              className="mt-2 text-sm leading-6 whitespace-pre-line"
              style={{ color: s.desktop_footer_text_color }}
            >
              {s.desktop_footer_about_us_content ||
                "Welcome to our store! We're here to bring you quality products and services with convenience, care, and trust."}
            </p>
          </div>
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: s.desktop_footer_title_color }}
            >
              {s.desktop_footer_links_title || "Links"}
            </h3>
            <ul className="mt-2 space-y-2">
              {links.length ? (
                links.map((it: any, i: number) => (
                  <li key={i}>
                    <a
                      href={getHref(it)}
                      className="text-sm hover:underline"
                      style={{ color: s.desktop_footer_link_color }}
                    >
                      {getLabel(it)}
                    </a>
                  </li>
                ))
              ) : (
                <li
                  className="text-sm opacity-60"
                  style={{ color: s.desktop_footer_text_color }}
                >
                  No links added yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- search dialog ---------------- */
const SearchDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  placeholder?: string;
}> = ({ open, onClose, placeholder }) => {
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
      className="fixed inset-0 bg-black/60 flex items-start justify-center p-3 sm:p-4 md:p-8"
      onMouseDown={onClose}
      onTouchStart={onClose}
      aria-modal="true"
      role="dialog"
      style={{ zIndex: 8000 }}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-5 right-0 sm:-top-6 sm:-right-6 h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center"
        >
          ✕
        </button>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 md:px-3 py-2">
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
              placeholder={placeholder || "Search for categories or products"}
            />
            <span className="text-slate-600 opacity-80">
              <SvgIcon id="search" className="w-5 h-5" />
            </span>
          </div>
          <div className="min-h-[55vh]" />
        </div>
      </div>
    </div>
  );
};

/* ---------------- main component ---------------- */
export default function BottomNav({
  settings = {} as any,
}: {
  settings?: any;
}) {
  const s = settings || {};
  const navigate = useNavigate();

  // remember slug on mount (keeps “sticky” after full reload)
  useEffect(() => {
    rememberSlug();
  }, []);

  const {
    visibility = "all",
    footer_background_color = "#ffffff",
    footer_text_color = "#4b5563",
    footer_text_active_color = "#030712",
    show_desktop_footer = true,
    show_desktop_footer_in_mobile_too = false,
    desktop_footer_background_color = "#f3f4f6",
    desktop_footer_title_color = "#111827",
    desktop_footer_text_color = "#6b7280",
    desktop_footer_link_color = "#111827",
    desktop_footer_about_us_title = "About Us",
    desktop_footer_about_us_content = "",
    desktop_footer_links_title = "Links",
    desktop_footer_links = [],
    custom_css = null,
    desktop_search_bar_placeholder_text = "Search products",
  } = s;

  const isMobile = useIsMobile();
  const cartCount = useCartCount();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [measuredH, setMeasuredH] = useState<number>(64); // fallback spacer

  // CUSTOMER auth (same as TopNav)
  const auth = useCustomerAuth();
  const tokenFromLS =
    (typeof window !== "undefined" &&
      (localStorage.getItem("customer_auth_token") ||
        localStorage.getItem("customer_auth_user") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token"))) ||
    "";
  const isLoggedIn = Boolean(auth?.user?.id || tokenFromLS);

  // logout watcher (like TopNav)
  const prevLoggedRef = useReactRef(isLoggedIn);
  useEffect(() => {
    prevLoggedRef.current = isLoggedIn;
  }, [isLoggedIn]);
  useEffect(() => {
    if (prevLoggedRef.current && !isLoggedIn) {
      redirectToHomeWithSlug();
    }
  }, [isLoggedIn]);

  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // hide/disable bar while an overlay is open
  const overlayActive = authOpen || searchOpen;

  // after login → go straight to slug-aware profile
  useEffect(() => {
    if (authOpen && isLoggedIn) {
      setAuthOpen(false);
      navigate(buildRoute("profile"));
    }
  }, [authOpen, isLoggedIn, navigate]);

  const items = useMemo(
    () => [
      {
        key: "home" as const,
        onClick: (): void => {
          const slug = getPreferredSlug();
          window.location.href = `${getBase()}${slug ? `/${slug}` : ""}/`;
        },
        isActive: (): boolean => isRouteActive("", true),
      },
      {
        key: "search" as const,
        onClick: (): void => {
          setSearchOpen(true);
        },
        isActive: (): boolean => false,
      },
      {
        key: "cart" as const,
        onClick: (): void => {
          navigate(buildRoute("checkout")); // basename-safe
        },
        isActive: (): boolean => false,
      },
      {
        key: "account" as const,
        onClick: (): void => {
          if (isLoggedIn) {
            navigate(buildRoute("profile"));
          } else {
            setAuthOpen(true);
          }
        },
        isActive: (): boolean => isRouteActive("profile", true),
      },
    ],
    [navigate, isLoggedIn]
  );

  useLayoutEffect(() => {
    const restore = () => {
      const scrollEl =
        (document.querySelector("[data-scroll-container]") as HTMLElement) ||
        (document.scrollingElement as HTMLElement) ||
        document.body;
      document.documentElement.style.removeProperty("--bottom-nav-height");
      scrollEl.style.paddingBottom = "";
    };

    if (!isMobile) {
      restore();
      return;
    }

    const el = navRef.current;
    if (!el) return;

    const setPad = () => {
      const h = el.getBoundingClientRect().height || 0;
      setMeasuredH(h || 64);
      document.documentElement.style.setProperty(
        "--bottom-nav-height",
        `${h}px`
      );
      const scrollEl =
        (document.querySelector("[data-scroll-container]") as HTMLElement) ||
        (document.scrollingElement as HTMLElement) ||
        document.body;
      scrollEl.style.paddingBottom =
        "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 8px)";
    };

    setPad();
    window.addEventListener("resize", setPad);
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(setPad) : null;
    ro?.observe(el);

    return () => {
      window.removeEventListener("resize", setPad);
      ro?.disconnect();
      restore();
    };
  }, [isMobile, cartCount]);

  const hiddenByVisibility =
    (visibility === "desktop" && isMobile) ||
    (visibility === "mobile" && !isMobile);
  if (hiddenByVisibility) return null;

  const MobileBar = (
    <nav
      ref={navRef}
      aria-label="Bottom navigation"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        zIndex: 2500,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        borderTop: "1px solid rgba(100,116,139,0.15)",
        background: footer_background_color,
        WebkitTapHighlightColor: "transparent",
        pointerEvents: overlayActive ? "none" : "auto",
        visibility: overlayActive ? "hidden" : "visible",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "12px 18px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          color: footer_text_color,
        }}
      >
        {items.map((it) => {
          const active = it.isActive();
          const color = active ? footer_text_active_color : footer_text_color;
          return (
            <button
              key={it.key}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                it.onClick();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label={it.key}
              className="relative flex items-center justify-center"
              style={{
                color,
                height: 48,
                width: 48,
                borderRadius: 12,
                outline: "none",
                touchAction: "manipulation",
              }}
            >
              <SvgIcon id={it.key} className="w-[22px] h-[22px]" />
              {it.key === "cart" && cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center rounded-full bg-rose-600 text-white"
                  style={{
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );

  const showLinksPanel =
    !!show_desktop_footer && (!isMobile || !!show_desktop_footer_in_mobile_too);

  return (
    <>
      {showLinksPanel && (
        <LinksFooter
          s={{
            desktop_footer_background_color,
            desktop_footer_title_color,
            desktop_footer_text_color,
            desktop_footer_link_color,
            desktop_footer_about_us_title,
            desktop_footer_about_us_content,
            desktop_footer_links_title,
            desktop_footer_links,
          }}
        />
      )}

      {isMobile && (
        <div
          className="md:hidden"
          style={{ height: `var(--bottom-nav-height, ${measuredH}px)` }}
        />
      )}

      {isMobile ? MobileBar : null}

      {/* overlays */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder={desktop_search_bar_placeholder_text}
      />
      <CustomerLoginModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {custom_css ? <style>{custom_css}</style> : null}
    </>
  );
}
