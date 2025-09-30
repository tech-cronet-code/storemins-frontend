/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const fire = (name: string, detail?: any) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));

/* ---------------- Inline SVG icons (no external font) ---------------- */

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

  if (id === "home") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...stroke} d="M3 10.5 12 3l9 7.5" />
        <path {...stroke} d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
        <path {...stroke} d="M9 21v-6h6v6" />
      </svg>
    );
  }
  if (id === "search") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle {...stroke} cx="11" cy="11" r="7" />
        <path {...stroke} d="M20 20l-3.5-3.5" />
      </svg>
    );
  }
  if (id === "cart") {
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
  }
  // account
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...stroke} d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
      <path {...stroke} d="M3.5 21a8.5 8.5 0 0 1 17 0" />
    </svg>
  );
}

/* ---------------- Desktop links panel ---------------- */

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

/* ---------------- Main component ---------------- */

export default function BottomNav({
  settings = {} as any,
}: {
  settings?: any;
}) {
  const s = settings || {};

  // read settings with sane fallbacks
  const {
    visibility = "all",

    // mobile bar
    footer_background_color = "#ffffff",
    footer_text_color = "#4b5563",
    footer_text_active_color = "#030712",

    // desktop footer panel
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
  } = s;

  const isMobile = useIsMobile();
  const cartCount = useCartCount();
  const navRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () => [
      {
        key: "home" as const,
        onClick: () => {
          fire("nav:home");
          try {
            if (window?.location) window.location.href = "/";
          } catch {
            /* noop */
          }
        },
        isActive: () =>
          window?.location?.pathname === "/" ||
          window?.location?.pathname === "/home",
      },
      {
        key: "search" as const,
        onClick: () => fire("search:open"),
        isActive: () => false,
      },
      {
        key: "cart" as const,
        onClick: () => fire("cart:open"),
        isActive: () => false,
      },
      {
        key: "account" as const,
        onClick: () => fire("account:open"),
        isActive: () => false,
      },
    ],
    []
  );

  // Reserve space under the fixed mobile bar
  useLayoutEffect(() => {
    const restore = () => {
      if (typeof document === "undefined") return;
      const scrollEl =
        (document.querySelector("[data-scroll-container]") as HTMLElement) ||
        (document.scrollingElement as HTMLElement) ||
        document.body;
      document.documentElement.style.removeProperty("--bottom-nav-height");
      if (scrollEl) scrollEl.style.paddingBottom = "";
    };

    if (!isMobile) {
      restore();
      return;
    }

    const el = navRef.current;
    if (!el || typeof document === "undefined") return;

    const setPad = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty(
        "--bottom-nav-height",
        `${h}px`
      );
      const scrollEl =
        (document.querySelector("[data-scroll-container]") as HTMLElement) ||
        (document.scrollingElement as HTMLElement) ||
        document.body;
      if (scrollEl) {
        scrollEl.style.paddingBottom =
          "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 8px)";
      }
    };

    setPad();
    window.addEventListener("resize", setPad);
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(setPad) : null;
    try {
      ro?.observe(el);
    } catch {
      /* noop */
    }

    return () => {
      window.removeEventListener("resize", setPad);
      try {
        ro?.disconnect();
      } catch {
        /* noop */
      }
      restore();
    };
  }, [isMobile, cartCount]);

  // visibility rules
  const hiddenByVisibility =
    (visibility === "desktop" && isMobile) ||
    (visibility === "mobile" && !isMobile);
  if (hiddenByVisibility) return null;

  /* ---------- Mobile bottom bar ---------- */
  const MobileBar = (
    <nav
      ref={navRef}
      aria-label="Bottom navigation"
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        maxWidth: "100%",
        borderTop: "1px solid rgba(100,116,139,0.15)",
        background: footer_background_color,
        WebkitTapHighlightColor: "transparent",
        boxSizing: "border-box",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 14px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
          color: footer_text_color,
          margin: 0,
          maxWidth: "100%",
        }}
      >
        {items.map((it) => {
          const active = it.isActive();
          const color = active ? footer_text_active_color : footer_text_color;
          return (
            <button
              key={it.key}
              onClick={it.onClick}
              aria-label={it.key}
              className="relative flex items-center justify-center"
              style={{
                color,
                height: 44,
                width: 44,
                borderRadius: 10,
                outline: "none",
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

      {/* Spacer so the last content never hides behind the fixed bar */}
      {isMobile && (
        <div
          className="md:hidden"
          style={{ height: "var(--bottom-nav-height)" }}
        />
      )}

      {isMobile ? MobileBar : null}

      {custom_css ? <style>{custom_css}</style> : null}
    </>
  );
}
