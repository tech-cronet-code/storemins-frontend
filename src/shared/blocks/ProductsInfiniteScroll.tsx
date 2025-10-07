/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { convertPath } from "../../modules/auth/utils/useImagePath";
import { useAuth } from "../../modules/auth/contexts/AuthContext";
import {
  useListCategoriesQuery,
  useListProductsQuery,
  ProductCategoryListResponse,
  ProductListItem,
} from "../../modules/auth/services/productApi";
import CartDock from "./CartDock";

/* ------------------------- utils ------------------------- */
const cn = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");

const FALLBACK_IMG =
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'><rect width='100%' height='100%' fill='#f3f4f6'/><g fill='#9ca3af' font-family='system-ui,Segoe UI,Roboto,sans-serif' font-size='18' text-anchor='middle'><text x='240' y='180'>Image</text></g></svg>`
  );

const looksLikeUrl = (s: string) =>
  /^https?:\/\//i.test(s) || s.startsWith("/");

/** Convert diskName -> full URL with convertPath; fallback to /image/original/product/<disk> */
function toProductImageUrl(diskName?: string): string {
  if (!diskName) return "";
  try {
    const u = convertPath(diskName, "original/product") as string | undefined;
    if (u) return u;
  } catch {
    /* ignore */
  }
  const base =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.VITE_IMAGE_BASE_URL ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).env?.VITE_API_BASE_URL ||
    "";
  const root = String(base || "").replace(/\/+$/, "");
  return root
    ? `${root}/image/original/product/${diskName}`
    : `/image/original/product/${diskName}`;
}

/** Get media diskName with order===0 (or first) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPrimaryMediaDiskName(product: any): string | undefined {
  const arr: Array<{ url?: string; order?: number }> | undefined =
    product?.media;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return (arr.find((m) => m?.order === 0)?.url ?? arr[0]?.url) || undefined;
}

/** Robust primary image URL resolver (handles media OR images) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPrimaryImageUrl(product: any): string {
  const disk = getPrimaryMediaDiskName(product);
  if (disk) return toProductImageUrl(disk);

  const imgs: unknown = product?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") {
      return looksLikeUrl(first) ? first : toProductImageUrl(first);
    }
  }
  return "";
}

// rupees → paise
const toPaise = (v: any): number => {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return Math.round(v * 100);
  const s = String(v).replace(/[^\d.]/g, "");
  if (!s) return 0;
  const n = Number(s);
  return isFinite(n) ? Math.round(n * 100) : 0;
};

/* ------------------------------ bits ------------------------------ */
const Price: React.FC<{
  value?: number;
  currency?: string;
  noGroup?: boolean;
}> = ({ value = 0, currency = "INR", noGroup = true }) => {
  const formatted = useMemo(() => {
    const rupees = Math.round((value ?? 0) / 100);
    if (currency === "INR") {
      const body = noGroup
        ? String(rupees)
        : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
            rupees
          );
      return "₹" + body;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      useGrouping: !noGroup ? true : false,
    }).format(rupees);
  }, [value, currency, noGroup]);

  return <span>{formatted}</span>;
};

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} width="16" height="16">
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* -------------------- ornamental MENU heading -------------------- */
const MenuOrnament: React.FC<{
  text?: string;
  className?: string;
  color?: string;
}> = ({ text = "What I offer", className, color = "#6B7280" }) => (
  <div
    className={cn(
      "flex items-center justify-center gap-3 my-0 select-none",
      className
    )}
    style={{ color }}
  >
    <div className="flex items-center justify-center w-8">
      <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
        <path
          d="M25 6H12c-2.2 0-3.3 1.7-3.4 3.1C8.4 10 7.4 11 6 11a5 5 0 0 1 0-10c1.4 0 2.5 .9 2.6 2C8.8 1.8 10.5 1 12.2 1H25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span
      className="uppercase text-[12px] font-semibold"
      style={{ letterSpacing: "0.45em" }}
    >
      {text}
    </span>
    <div className="flex items-center justify-center w-8">
      <svg
        width="26"
        height="12"
        viewBox="0 0 26 12"
        style={{ transform: "scaleX(-1)" }}
        aria-hidden="true"
      >
        <path
          d="M25 6H12c-2.2 0-3.3 1.7-3.4 3.1C8.4 10 7.4 11 6 11a5 5 0 0 1 0-10c1.4 0 2.5 .9 2.6 2C8.8 1.8 10.5 1 12.2 1H25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const ProductCard = ({
  p,
  onAddToCart,
}: {
  p: any;
  onAddToCart: (p: any) => void;
}) => {
  const pricePaise = toPaise(
    p.discountedPrice ?? p.price ?? p.finalPrice ?? p.currentPrice
  );
  const mrpPaise = toPaise(p.price ?? p.mrp ?? p.listPrice);
  const hasMrp = mrpPaise > pricePaise && pricePaise > 0;
  const pct =
    hasMrp && mrpPaise
      ? Math.max(
          0,
          Math.min(100, Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100))
        )
      : null;

  const img = getPrimaryImageUrl(p) || FALLBACK_IMG;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-[0_6px_24px_-12px_rgba(0,0,0,0.2)] transition-all hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.25)]">
      <Link to={`p/${p.slug || p.id}`} className="block">
        <div className="relative aspect-square bg-slate-50">
          <img
            src={img}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2">
          <div className="text-[13.5px] sm:text-[15px] font-semibold text-slate-900 line-clamp-2">
            {p.name}
          </div>
          <div className="mt-1 flex items-baseline gap-2 leading-none">
            <span className="text-[16px] sm:text-[18px] font-semibold text-slate-900">
              <Price value={pricePaise} currency={p.currency} noGroup />
            </span>
            {pct !== null && (
              <span className="text-[12px] sm:text-[13px] font-semibold text-amber-600">
                ({pct}% Off)
              </span>
            )}
          </div>
          {hasMrp && (
            <div className="mt-1 text-[12px] sm:text-[13px] text-slate-400 line-through">
              <Price value={mrpPaise} currency={p.currency} noGroup />
            </div>
          )}
        </div>
      </Link>
      <button
        onClick={() => onAddToCart(p)}
        className="mt-auto w-full py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-rose-600 text-center border-t border-slate-100 hover:bg-rose-50 transition-colors"
        aria-label={`Add ${p.name}`}
      >
        Add to Cart
      </button>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white h-full flex flex-col shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)]">
    <div className="bg-slate-200/70 animate-pulse aspect-square" />
    <div className="px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2 space-y-2">
      <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
    </div>
    <div className="h-[42px] sm:h-[44px] border-t border-slate-100 bg-slate-100/40" />
  </div>
);

/* --------------------------- collapse helper --------------------------- */
function useAutoHeight(collapsed: boolean, deps: any[] = []) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const target = collapsed ? 0 : el.scrollHeight;
      if (!collapsed) {
        setMaxH(target);
        window.setTimeout(() => setMaxH(99999), 260);
      } else {
        setMaxH(el.scrollHeight);
        requestAnimationFrame(() => setMaxH(0));
      }
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el!);
    measure();
    return () => ro.disconnect();
  }, [collapsed, ...deps]);
  return { ref, maxH } as const;
}

/* --------------------------- main component --------------------------- */
type Props = { settings?: any };

export default function StorefrontWithApiImages({ settings = {} }: Props) {
  const s = settings || {};

  const { userDetails } = useAuth() as any;
  const businessId: string =
    userDetails?.storeLinks?.[0]?.businessId?.trim?.() || "";
  const skip = !businessId;

  const [cats, setCats] = useState<
    Array<{ id: string; name: string; count?: number }>
  >([]);
  const [productsByCat, setProductsByCat] = useState<Record<string, any[]>>({});
  const [loadingByCat, setLoadingByCat] = useState<Record<string, boolean>>({});
  const [doneByCat, setDoneByCat] = useState<Record<string, boolean>>({});
  const [cursorByCat, setCursorByCat] = useState<Record<string, number | null>>(
    {}
  );
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileSheet, setMobileSheet] = useState(false);

  const take = 24;
  const gridClass = "pgrid grid gap-3 sm:gap-4 lg:gap-6";

  /* categories */
  const { data: catResp } = useListCategoriesQuery({ businessId }, { skip });

  useEffect(() => {
    const listRaw = Array.isArray(catResp)
      ? catResp
      : (catResp as ProductCategoryListResponse[] | any) ?? [];
    const compact = (listRaw || [])
      .map((c: any) => ({
        id: String(c.id ?? c.slug ?? c.value ?? c),
        name: String(c.name ?? c.label ?? c),
        count:
          Number(c.productCount ?? c.count ?? c.itemsCount ?? c.total ?? 0) ||
          undefined,
      }))
      .filter((c: { id: any; name: any }) => c.id && c.name);

    setCats(compact);
    if (compact.length) {
      setActiveCatId(compact[0].id);
      setCollapsed(
        Object.fromEntries(
          compact.map((c: { id: any }, i: number) => [c.id, i !== 0])
        )
      );
    }
  }, [catResp]);

  /* products: all types */
  const { data: physical = [], isFetching: f1 } = useListProductsQuery(
    { businessId, type: "PHYSICAL" },
    { skip }
  );
  const { data: digital = [], isFetching: f2 } = useListProductsQuery(
    { businessId, type: "DIGITAL" },
    { skip }
  );
  const { data: meeting = [], isFetching: f3 } = useListProductsQuery(
    { businessId, type: "MEETING" },
    { skip }
  );
  const { data: workshop = [], isFetching: f4 } = useListProductsQuery(
    { businessId, type: "WORKSHOP" },
    { skip }
  );

  const allProductsByParent = useMemo(() => {
    const all: ProductListItem[] = [
      ...physical,
      ...digital,
      ...meeting,
      ...workshop,
    ];
    const normed = all.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : p.images ? [p.images] : [],
    }));
    const map: Record<string, any[]> = {};
    for (const p of normed) {
      const links = Array.isArray(p.categoryLinks) ? p.categoryLinks : [];
      const parentIds = links
        .map((l: any) => l?.parentCategoryId)
        .filter(Boolean);
      for (const pid of parentIds) {
        if (!map[pid]) map[pid] = [];
        if (!map[pid].some((x) => x.id === p.id)) map[pid].push(p);
      }
    }
    return map;
  }, [physical, digital, meeting, workshop]);

  /* pagination per category (client-side) */
  const fetchPage = async (catId: string) => {
    if (loadingByCat[catId] || doneByCat[catId]) return;
    setLoadingByCat((m) => ({ ...m, [catId]: true }));
    try {
      const fullList = allProductsByParent[catId] || [];
      const cur = cursorByCat[catId] ?? 0;
      const nextSlice = fullList.slice(cur, cur + take);

      setProductsByCat((m) => ({
        ...m,
        [catId]: [
          ...(m[catId] || []),
          ...nextSlice.filter(
            (x) => !(m[catId] || []).some((y) => y.id === x.id)
          ),
        ],
      }));

      const next = cur + nextSlice.length;
      const isDone = next >= fullList.length || nextSlice.length === 0;
      setCursorByCat((m) => ({ ...m, [catId]: next }));
      setDoneByCat((m) => ({ ...m, [catId]: isDone }));
    } catch {
      setDoneByCat((m) => ({ ...m, [catId]: true }));
    } finally {
      setLoadingByCat((m) => ({ ...m, [catId]: false }));
    }
  };

  useEffect(() => {
    cats.forEach((c) => {
      if (!collapsed[c.id] && !(productsByCat[c.id]?.length > 0))
        fetchPage(c.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, cats.length, allProductsByParent]);

  /* active section highlight */
  useEffect(() => {
    if (!cats.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = top?.target.getAttribute("data-cat-section");
        if (id) setActiveCatId(id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    cats.forEach((c) => {
      const el = document.querySelector(`[data-cat-section="${c.id}"]`);
      if (el) io.observe(el as Element);
    });
    return () => io.disconnect();
  }, [cats.length]);

  /* cart demo */
  const handleAddToCart = (p: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const i = cart.findIndex((x: any) => x.id === p.id);
      if (i > -1) cart[i].qty += 1;
      else
        cart.push({
          id: p.id,
          name: p.name,
          price: p.discountedPrice ?? p.price,
          image: getPrimaryImageUrl(p) || FALLBACK_IMG,
          qty: 1,
          currency: p.currency || "INR",
        });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      /* empty */
    }
    try {
      window.dispatchEvent(
        new CustomEvent("cart:add", { detail: { id: p.id } })
      );
    } catch {
      /* empty */
    }
  };

  /* per-category section */
  function CategorySection({
    cat,
  }: {
    cat: { id: string; name: string; count?: number };
  }) {
    const isClosed = !!collapsed[cat.id];
    const list = productsByCat[cat.id] || [];
    const { ref, maxH } = useAutoHeight(isClosed, [list.length]);
    const anyFetching = f1 || f2 || f3 || f4;

    return (
      <section
        className="mb-6 lg:mb-8"
        id={`cat-${cat.id}`}
        data-cat-section={cat.id}
      >
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <button
            onClick={() =>
              setCollapsed((m) => ({ ...m, [cat.id]: !m[cat.id] }))
            }
            className="w-full flex items-center justify-between px-4 py-3 sm:px-5 lg:px-6 hover:bg-slate-50 transition-colors"
            aria-expanded={!isClosed}
          >
            <div className="text-left">
              <div className="text-[15px] sm:text-lg font-semibold text-slate-900">
                {cat.name}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                {(cat.count ?? list.length) || 0} items
              </div>
            </div>
            <span
              className={cn(
                "text-slate-600 transition-transform",
                !isClosed && "rotate-180"
              )}
              aria-hidden="true"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </span>
          </button>

          <div
            ref={ref}
            style={{
              overflow: "hidden",
              transition: "max-height 260ms ease",
              maxHeight: `${maxH}px`,
            }}
          >
            {!isClosed && (
              <div className="p-3 sm:p-4 lg:p-6 border-t border-slate-100">
                <div className={gridClass}>
                  {anyFetching && list.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    : list.map((p) => (
                        <ProductCard
                          key={p.id}
                          p={p}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                  {!loadingByCat[cat.id] &&
                    !anyFetching &&
                    list.length === 0 && (
                      <div className="col-span-full text-slate-500 text-sm">
                        No products in {cat.name}
                      </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-center">
                  {!doneByCat[cat.id] ? (
                    <button
                      onClick={() => fetchPage(cat.id)}
                      disabled={!!loadingByCat[cat.id]}
                      className={cn(
                        "px-4 py-2 rounded-xl border border-slate-300 text-sm hover:bg-slate-50 transition-all",
                        loadingByCat[cat.id] && "opacity-60 cursor-wait"
                      )}
                    >
                      {loadingByCat[cat.id] ? "Loading…" : "Show more"}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------- Mobile Category Sheet -------------------------- */
  const MobileCatSheet = (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-[70] transition",
        mobileSheet ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setMobileSheet(false)}
      aria-hidden={!mobileSheet}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-sm bg-[#2B2F33] text-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 text-[11px] tracking-wide opacity-80 sticky top-0 bg-[#2B2F33]">
            EXPLORE CATEGORIES
          </div>
          <div className="max-h-[75vh] overflow-y-auto divide-y divide-white/10">
            {cats.map((c) => (
              <button
                key={c.id}
                className={cn(
                  "w-full text-left px-4 py-3 text-[13px]",
                  activeCatId === c.id
                    ? "bg-white/10 font-semibold"
                    : "hover:bg-white/5"
                )}
                onClick={() => {
                  setActiveCatId(c.id);
                  setCollapsed((m) => ({ ...m, [c.id]: false }));
                  setMobileSheet(false);
                  document
                    .getElementById(`cat-${c.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {c.name}
                {typeof c.count === "number" && (
                  <span className="ml-2 text-white/70">({c.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#fafafa]">
      <style>{`
        .pgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 639.98px) { .pgrid { gap: 12px; } }
        @media (min-width: 640px)  { .pgrid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
        @media (min-width: 1024px) { .pgrid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); } }
        @media (min-width: 1536px) { .pgrid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
      `}</style>

      <div className="w-full px-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-14 py-6 lg:py-8 mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl lg:text-2xl font-semibold text-slate-900">
              {s.title || "Explore all"}
            </div>
            <div className="text-sm mt-1 text-slate-500">
              {s.subtitle || "Discover our full collection, just for you."}
            </div>
          </div>
          {cats.length > 0 && (
            <button
              onClick={() => setMobileSheet(true)}
              className="lg:hidden inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-full bg-slate-100 text-slate-800"
            >
              <ChevronDownIcon className="w-3 h-3 -rotate-90" />
              Explore categories
            </button>
          )}
        </div>

        <div className="flex flex-nowrap gap-6 xl:gap-8 2xl:gap-10">
          <aside className="hidden lg:block w-[260px] xl:w-[300px] 2xl:w-[340px] shrink-0">
            {cats.length > 0 && (
              <div className="sticky top-2">
                <MenuOrnament className="mt-2 mb-2" />
                <div className="text-[12px] tracking-wide text-slate-500 mb-2 px-2">
                  CATEGORIES
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden max-h-[70vh] shadow-sm">
                  <div className="divide-y divide-slate-100 overflow-y-auto">
                    {cats.map((c) => (
                      <button
                        key={c.id}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50",
                          activeCatId === c.id && "bg-slate-100 font-semibold"
                        )}
                        onClick={() => {
                          setActiveCatId(c.id);
                          setCollapsed((m) => ({ ...m, [c.id]: false }));
                          document
                            .getElementById(`cat-${c.id}`)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                      >
                        <span className="truncate">{c.name}</span>
                        {typeof c.count === "number" && (
                          <span className="ml-3 shrink-0 text-xs text-slate-500">
                            {c.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          <div
            className="hidden lg:block w-px self-stretch bg-slate-900/10 rounded-full"
            aria-hidden="true"
          />

          <main className="min-w-0 flex-1">
            <div className="mb-3 flex gap-2 justify-end">
              {cats.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      setCollapsed(
                        Object.fromEntries(cats.map((c) => [c.id, false]))
                      )
                    }
                    className="px-3 py-1.5 text-sm rounded-xl border border-slate-300 hover:bg-slate-50"
                  >
                    Expand all
                  </button>
                  <button
                    onClick={() =>
                      setCollapsed(
                        Object.fromEntries(cats.map((c) => [c.id, true]))
                      )
                    }
                    className="px-3 py-1.5 text-sm rounded-xl border border-slate-300 hover:bg-slate-50"
                  >
                    Collapse all
                  </button>
                </>
              )}
            </div>

            {cats.map((c) => (
              <CategorySection key={c.id} cat={c} />
            ))}
          </main>
        </div>
      </div>

      {MobileCatSheet}

      {/* Reusable cart dock */}
      <CartDock bottomOffsetPx={0} zIndex={6000} />
    </section>
  );
}
