import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StorefrontLayout from "./StorefrontLayout";

import {
  ProductListItem,
  useListProductsQuery,
} from "../../modules/auth/services/productApi";
import { convertPath } from "../../modules/auth/utils/useImagePath";
import { useAuth } from "../../modules/auth/contexts/AuthContext";
import CartDock from "./CartDock";
import { useAddItemToCartMutation } from "../../modules/customer/services/customerCartApi";

/* ------------------------------ local types ------------------------------ */
type MediaItem = { url?: string; order?: number | null | undefined };

type ProductLike = ProductListItem & {
  slug?: string;
  currency?: string | null;

  // pricing
  price?: number | string | null;
  discountedPrice?: number | string | null;
  salePrice?: number | string | null;
  finalPrice?: number | string | null;
  currentPrice?: number | string | null;
  mrp?: number | string | null;
  listPrice?: number | string | null;
  originalPrice?: number | string | null;
  compareAtPrice?: number | string | null;
  strikePrice?: number | string | null;

  // media
  image?: string | null;
  images?: string[] | string | null;
  media?: MediaItem[] | null;

  // details
  shortDescription?: string | null;
  description?: string | null;
  brand?: string | null;
  attributes?: Array<{ name?: string; value?: string }>;
  specs?: Record<string, unknown>;
  stock?: number | null;
  isInStock?: boolean | null;
};

type Coupon = {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  badge: "DEAL" | "NEW" | "₹" | "%";
  badgeBg: string;
  badgeFg: string;
  accent?: string;
};

/* ------------------------------ utilities ------------------------------ */
const cn = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");

const FALLBACK_IMG =
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480'><rect width='100%' height='100%' fill='#f3f4f6'/><g fill='#9ca3af' font-family='system-ui,Segoe UI,Roboto,sans-serif' font-size='18' text-anchor='middle'><text x='240' y='240'>Image</text></g></svg>`
  );

const looksLikeUrl = (s: string) =>
  /^https?:\/\//i.test(s) || s.startsWith("/");

function toProductImageUrl(diskName?: string): string {
  if (!diskName) return "";
  try {
    const u = convertPath(diskName, "original/product") as string | undefined;
    if (u) return u;
  } catch {
    /* ignore */
  }
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  const base = env?.["VITE_IMAGE_BASE_URL"] || env?.["VITE_API_BASE_URL"] || "";
  const root = String(base || "").replace(/\/+$/, "");
  return root
    ? `${root}/image/original/product/${diskName}`
    : `/image/original/product/${diskName}`;
}

function toStr(u: unknown): string {
  if (u == null) return "";
  return String(u);
}

// rupees → paise
function toPaise(v: number | string | null | undefined): number {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return Math.round(v * 100);
  const s = String(v).replace(/[^\d.]/g, "");
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/* ------------------------------ image helpers ------------------------------ */
function getPrimaryMediaDiskName(
  product: { media?: MediaItem[] | null } | null | undefined
): string | undefined {
  const arr = product?.media;
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return (arr.find((m) => m?.order === 0)?.url ?? arr[0]?.url) || undefined;
}

function normalizeUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  const s = String(u).trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return "https:" + s;
  if (/^data:|^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return s;
  return s;
}

function getAllImageUrls(p: ProductLike): string[] {
  const out: string[] = [];

  const disk = getPrimaryMediaDiskName(p);
  if (disk) {
    const u = toProductImageUrl(disk);
    if (u) out.push(u);
  }

  if (Array.isArray(p.media)) {
    const sorted = [...p.media].sort(
      (a, b) => (a.order ?? 1e9) - (b.order ?? 1e9)
    );
    for (const m of sorted) {
      const u = m?.url ? toProductImageUrl(m.url) : undefined;
      if (u) out.push(u);
    }
  }

  if (Array.isArray(p.images)) {
    for (const img of p.images) {
      const u = looksLikeUrl(String(img))
        ? String(img)
        : toProductImageUrl(String(img));
      const n = normalizeUrl(u);
      if (n) out.push(n);
    }
  } else if (typeof p.images === "string") {
    const u = looksLikeUrl(p.images) ? p.images : toProductImageUrl(p.images);
    const n = normalizeUrl(u);
    if (n) out.push(n);
  }

  const single = normalizeUrl(p.image ?? undefined);
  if (single) out.push(single);

  return Array.from(new Set(out.length ? out : [FALLBACK_IMG]));
}

/* ------------------------------ price helpers ------------------------------ */
const PriceText: React.FC<{
  valuePaise: number;
  currency?: string;
  strike?: boolean;
  strong?: boolean;
  className?: string;
}> = ({
  valuePaise,
  currency = "INR",
  strike = false,
  strong = false,
  className,
}) => {
  const formatted = useMemo(() => {
    const rupees = Math.round(valuePaise / 100);
    if (currency === "INR") {
      return (
        "₹" +
        new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
          rupees
        )
      );
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(rupees);
  }, [valuePaise, currency]);

  return (
    <span
      className={cn(
        className,
        strike && "line-through text-slate-400",
        strong && "font-semibold text-slate-900"
      )}
    >
      {formatted}
    </span>
  );
};

/** Compute selling price, MRP and discount %. */
function computePrice(p?: ProductLike) {
  if (!p) return { price: 0, mrp: 0, pct: null as number | null };

  const sellPaise = toPaise(
    p.discountedPrice ??
      p.salePrice ??
      p.finalPrice ??
      p.currentPrice ??
      p.price
  );

  let mrpPaise = toPaise(
    p.mrp ?? p.listPrice ?? p.originalPrice ?? p.compareAtPrice ?? p.strikePrice
  );

  const basePricePaise = toPaise(p.price);
  const hasExplicitDiscount =
    toPaise(
      p.discountedPrice ?? p.salePrice ?? p.finalPrice ?? p.currentPrice
    ) > 0 && basePricePaise > 0;

  if (mrpPaise === 0 && hasExplicitDiscount) {
    mrpPaise = basePricePaise;
  }

  let pct: number | null = null;
  if (mrpPaise > sellPaise && sellPaise > 0) {
    pct = Math.max(
      0,
      Math.min(100, Math.round(((mrpPaise - sellPaise) / mrpPaise) * 100))
    );
  } else if (sellPaise > 0 && mrpPaise === 0) {
    mrpPaise = Math.round(sellPaise * 1.25);
    pct = Math.max(
      0,
      Math.min(100, Math.round(((mrpPaise - sellPaise) / mrpPaise) * 100))
    );
  }

  return { price: sellPaise, mrp: mrpPaise, pct };
}

/* ------------------------------ small UI bits ------------------------------ */
const Thumb: React.FC<{
  src: string;
  active?: boolean;
  onClick: () => void;
}> = ({ src, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "shrink-0 p-1.5 rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-sky-300/60",
      active
        ? "bg-sky-100/70 border-sky-300 shadow-sm shadow-sky-100"
        : "bg-slate-100 border-slate-200 hover:border-slate-300"
    )}
    aria-label="Select image"
  >
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white">
      <img src={src} alt="" className="w-full h-full object-cover" />
    </div>
  </button>
);

type SectionPadProps = React.PropsWithChildren<{
  top?: boolean;
  bottom?: boolean;
  className?: string;
}>;

const SectionPad: React.FC<SectionPadProps> = ({
  top = false,
  bottom = false,
  className,
  children,
}) => (
  <div
    className={cn(top && "pt-4 sm:pt-5", bottom && "pb-4 sm:pb-5", className)}
  >
    {children}
  </div>
);

const SpecsGrid: React.FC<{
  attributes?: Array<{ name?: string; value?: string }>;
  specs?: Record<string, unknown>;
}> = ({ attributes, specs }) => {
  if (!attributes?.length && !specs) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {attributes?.map((a, i) =>
        a?.name ? (
          <div
            key={`attr-${i}`}
            className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
          >
            <div className="text-slate-500">{a.name}</div>
            <div className="font-medium text-slate-800">{a.value ?? "-"}</div>
          </div>
        ) : null
      )}
      {specs &&
        (Object.entries(specs) as Array<[string, unknown]>).map(([k, v]) => (
          <div
            key={`spec-${k}`}
            className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
          >
            <div className="text-slate-500">{k}</div>
            <div className="font-medium text-slate-800">{String(v ?? "-")}</div>
          </div>
        ))}
    </div>
  );
};

/* ------------------------------ Coupon Modal ------------------------------ */
const CouponModal: React.FC<{
  open: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
}> = ({ open, onClose, coupon }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open || !coupon) return null;

  const copy = async () => {
    try {
      if (coupon.code) {
        await navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center -mt-6">
          <div
            className={cn(
              "rounded-full px-4 py-2 text-white text-xl font-bold shadow",
              coupon.badgeBg
            )}
          >
            %
          </div>
        </div>
        <div className="px-6 pt-6 pb-5 text-center">
          <div className="text-slate-400 text-xs tracking-widest font-semibold">
            {`'${coupon.code ?? "COUPON"}'`} APPLIED
          </div>
          <div className="mt-3 text-4xl font-extrabold text-slate-900">
            ₹{coupon.title.replace(/[^\d]/g, "") || "0"}
          </div>
          <div className="mt-1 text-slate-600">savings with this coupon.</div>

          {coupon.code && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="font-mono tracking-widest">{coupon.code}</span>
              <button
                onClick={copy}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-50"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600"
            >
              YAY!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Coupon Carousel ------------------------------ */
const CouponsCarousel: React.FC<{
  coupons: Coupon[];
  onOpen: (c: Coupon) => void;
}> = ({ coupons, onOpen }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const scrollBy = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const one = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "left" ? -one : one, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
    setActive(Math.max(0, Math.min(coupons.length - 1, idx)));
  };

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-semibold text-slate-900">
          Coupons & Discounts
        </div>
        <div className="hidden sm:block text-xs text-slate-500">
          {active + 1} / {coupons.length}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollBy("left")}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50"
          aria-label="Scroll coupons left"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy("right")}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow hover:bg-slate-50"
          aria-label="Scroll coupons right"
        >
          ›
        </button>

        <div
          ref={ref}
          onScroll={handleScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
        >
          {coupons.map((c, i) => (
            <button
              key={c.id}
              onClick={() => onOpen(c)}
              className="snap-start w-[85%] md:w-[420px] shrink-0 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:shadow transition"
              aria-label={`Open coupon ${c.title}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center text-sm font-black tracking-wider",
                    c.badgeBg,
                    c.badgeFg
                  )}
                >
                  {c.badge}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">
                    {c.title}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {c.subtitle}
                    {c.code ? ` | code: ${c.code}` : ""}
                  </div>
                </div>
                <div className="ml-auto text-[10px] text-slate-400 font-semibold">
                  {i + 1}/{coupons.length}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------ info cards ------------------------------ */
const ProductDetailsCard: React.FC<{ product: ProductLike }> = ({
  product,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <details open className="group">
      <summary className="list-none cursor-pointer px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          Product Details
        </span>
        <span className="text-slate-400 group-open:rotate-180 transition">
          ⌄
        </span>
      </summary>
      <div className="px-4 sm:px-5 py-4 space-y-4">
        {product.shortDescription && (
          <p className="text-slate-700">{product.shortDescription}</p>
        )}
        {product.description ? (
          <div className="prose max-w-none text-slate-700">
            {product.description}
          </div>
        ) : null}
        <SpecsGrid attributes={product.attributes} specs={product.specs} />
      </div>
    </details>
  </section>
);

const DeliveryInfoCard: React.FC = () => (
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <details className="group">
      <summary className="list-none cursor-pointer px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          Delivery Information
        </span>
        <span className="text-slate-400 group-open:rotate-180 transition">
          ⌄
        </span>
      </summary>
    </details>
    <div className="px-4 sm:px-5 py-4 space-y-3">
      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 w-fit">
        <span>🚚</span>
        <span className="text-sm text-slate-700">
          Tap to get delivery information
        </span>
      </div>
      <ul className="text-sm text-slate-700 space-y-2">
        <li className="flex items-start gap-2">
          <span className="mt-1 text-emerald-600">✓</span>
          <span>Free delivery on all orders</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 text-emerald-600">✓</span>
          <span>Direct delivery by the seller</span>
        </li>
      </ul>
      <p className="text-xs text-slate-500">
        Orders are usually dispatched within 24–48 hours. Tracking will be
        shared by SMS/email.
      </p>
    </div>
  </section>
);

const RefundReturnsCard: React.FC = () => (
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <details className="group">
      <summary className="list-none cursor-pointer px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-900">
          Refund & Returns
        </span>
        <span className="text-slate-400 group-open:rotate-180 transition">
          ⌄
        </span>
      </summary>
    </details>
    <div className="px-4 sm:px-5 py-4">
      <div className="text-sm text-slate-700 font-medium mb-2">
        Return & Exchange Policy
      </div>
      <ul className="text-sm text-slate-700 space-y-2">
        <li className="flex items-start gap-2">
          <span className="mt-1 text-slate-400">•</span>
          <span>3-day return/exchange window</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 text-slate-400">•</span>
          <span>Original condition with tags and packaging</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 text-slate-400">•</span>
          <span>Proof of purchase required</span>
        </li>
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Refunds are processed to the original payment method within 5–7 business
        days after quality check.
      </p>
    </div>
  </section>
);

/* ------------------------------ main component ------------------------------ */

/** Try to pick category name from various possible API shapes */
function pickCategoryName(p?: ProductLike | null): string | null {
  if (!p) return null;
  const anyp: any = p;

  const direct =
    anyp?.category?.name ||
    anyp?.category?.title ||
    anyp?.categoryName ||
    (Array.isArray(anyp?.categories) && anyp.categories[0]?.name) ||
    (Array.isArray(anyp?.categories) && anyp.categories[0]?.title);

  if (direct && String(direct).trim()) return String(direct).trim();

  const links = anyp?.categoryLinks;
  if (Array.isArray(links) && links.length) {
    const l = links[0] ?? {};
    const viaLink =
      l.categoryName ||
      l.name ||
      l?.category?.name ||
      l?.category?.title ||
      l?.parentCategoryName ||
      l?.parentCategory?.name ||
      l?.parent?.name;
    if (viaLink && String(viaLink).trim()) return String(viaLink).trim();
  }

  return null;
}

const ProductDetail: React.FC = () => {
  // Route params: /:storeSlug/p/:productSlug
  const { storeSlug = "", productSlug = "" } = useParams<{
    storeSlug?: string;
    productSlug?: string;
  }>();
  const [addItem] = useAddItemToCartMutation();

  // businessId from auth
  type AuthDetails = { storeLinks?: Array<{ businessId?: string | null }> };
  type AuthCtx = { userDetails?: AuthDetails };
  const { userDetails } = (useAuth() as AuthCtx) ?? {};
  const businessId: string =
    userDetails?.storeLinks?.[0]?.businessId?.trim?.() ?? "";
  const skip = !businessId;

  // fetch all product types (search locally)
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

  const all: ProductLike[] = useMemo(
    () =>
      [...physical, ...digital, ...meeting, ...workshop].map(
        (p) => p as ProductLike
      ),
    [physical, digital, meeting, workshop]
  );

  const [product, setProduct] = useState<ProductLike | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // coupon modal state
  const [couponOpen, setCouponOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // sample coupons
  const coupons = useMemo<Coupon[]>(
    () => [
      {
        id: "deal99",
        title: "Items At ₹99",
        subtitle: "ON SELECT ITEMS",
        badge: "DEAL",
        badgeBg: "bg-orange-500",
        badgeFg: "text-white",
      },
      {
        id: "newgift",
        title: "Free Gift",
        subtitle: "ON FIRST ORDER",
        badge: "NEW",
        badgeBg: "bg-slate-900",
        badgeFg: "text-white",
        code: "TRYNEW",
      },
      {
        id: "paytm20",
        title: "20% Cashback",
        subtitle: "WITH PAYTM",
        badge: "₹",
        badgeBg: "bg-sky-500",
        badgeFg: "text-white",
        code: "PAYTM20",
      },
      {
        id: "festive",
        title: "Festive Sale",
        subtitle: "ENDS TONIGHT",
        badge: "%",
        badgeBg: "bg-orange-500",
        badgeFg: "text-white",
        code: "FESTIVE10",
      },
    ],
    []
  );

  const anyFetching = f1 || f2 || f3 || f4;

  useEffect(() => {
    const found = all.find(
      (p) =>
        toStr(p.slug).toLowerCase() === productSlug.toLowerCase() ||
        toStr((p as ProductListItem).id) === productSlug
    );
    setProduct(found ?? null);
    setActiveIdx(0);
  }, [all, productSlug]);

  /* ---- derived state ---- */
  const images = useMemo<string[]>(
    () => (product ? getAllImageUrls(product) : [FALLBACK_IMG]),
    [product]
  );
  const primaryImage = images[0] ?? FALLBACK_IMG;

  const thumbs = useMemo(() => {
    const need = Math.max(3, images.length || 1);
    return Array.from({ length: need }, (_, i) => images[i] ?? primaryImage);
  }, [images, primaryImage]);

  const categoryLabel = useMemo(() => pickCategoryName(product), [product]);

  /* ---------------------- early returns ---------------------- */
  if (!productSlug) return <div className="p-6">Missing product slug.</div>;
  if (skip) return <div className="p-6">No business connected.</div>;
  if (anyFetching && !product) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const { price, mrp, pct } = computePrice(product);
  const currency = product.currency ?? "INR";
  const inStock =
    product.isInStock ??
    (typeof product.stock === "number" ? (product.stock ?? 0) > 0 : true);

  function addToCart(p: ProductLike, quantity: number) {
    // API-first; UI identical
    (async () => {
      try {
        await addItem({
          businessId,
          productId: String((p as ProductListItem).id),
          variantId: null,
          quantity,
        }).unwrap();

        window.dispatchEvent(
          new CustomEvent("cart:add", {
            detail: { id: String((p as ProductListItem).id), qty: quantity },
          })
        );
        window.dispatchEvent(new CustomEvent("cart:update"));
      } catch (err) {
        // noop fallback to keep dock feedback working
        try {
          window.dispatchEvent(
            new CustomEvent("cart:add", {
              detail: { id: String((p as ProductListItem).id), qty: quantity },
            })
          );
        } catch {
          /* empty */
        }
        console.error("Add to cart failed:", err);
      }
    })();
  }

  /* ------------------------------- RENDER ------------------------------- */
  return (
    <StorefrontLayout
      businessId={businessId}
      headerSettings={{ forceMenu: true, hideMenuOnDetail: false }}
      footerSettings={{}}
    >
      <div className="max-w-6xl mx-auto pb-12 px-3 sm:px-5 lg:px-8">
        {/* TOP BAR */}
        <div className="pt-4">
          <Link
            to={storeSlug ? `/${storeSlug}` : ".."}
            className="text-slate-500 hover:text-slate-700 hover:underline text-sm"
          >
            ← Back to store
          </Link>
        </div>
        <div className="mt-3 border-t border-slate-200/70" />

        {/* MOBILE */}
        <div className="lg:hidden mt-3">
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-gradient-to-b from-slate-50 to-white">
            <img
              src={thumbs[activeIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pl-1">
            {thumbs.map((src, i) => (
              <Thumb
                key={`m-${i}`}
                src={src}
                active={i === activeIdx}
                onClick={() => setActiveIdx(i)}
              />
            ))}
          </div>

          <div className="mt-5">
            {categoryLabel && (
              <div className="text-sky-600 font-semibold">{categoryLabel}</div>
            )}
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {product.name}
            </h1>
            {product.brand && (
              <div className="mt-1 text-sm text-slate-500">
                by {product.brand}
              </div>
            )}

            {/* PRICE BLOCK — compact, clean */}
            <div className="mt-3 flex items-baseline gap-2">
              <PriceText
                valuePaise={price}
                currency={currency}
                strong
                className="text-xl font-bold"
              />
              {mrp > price && (
                <>
                  <PriceText
                    valuePaise={mrp}
                    currency={currency}
                    strike
                    className="text-sm"
                  />
                  {pct !== null && (
                    <span className="text-xs font-semibold text-amber-600">
                      {pct}% Off
                    </span>
                  )}
                </>
              )}
            </div>

            {/* STOCK — quiet, inline */}
            <div
              className={cn(
                "mt-1.5 flex items-center gap-2 text-sm",
                inStock ? "text-emerald-700" : "text-rose-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  inStock ? "bg-emerald-500" : "bg-rose-500"
                )}
              />
              {inStock ? "In stock" : "Out of stock"}
            </div>

            {product.shortDescription && (
              <div className="mt-3 text-slate-700 text-sm leading-relaxed">
                {product.shortDescription}
              </div>
            )}

            <div className="mt-4 flex items-stretch gap-3">
              <div className="inline-flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-slate-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-14 text-center outline-none py-2"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 hover:bg-slate-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                disabled={!inStock}
                onClick={() => addToCart(product, qty)}
                className="flex-1 px-4 rounded-xl bg-slate-900 text-white font-medium shadow hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
            </div>

            <CouponsCarousel
              coupons={coupons}
              onOpen={(c) => {
                setSelectedCoupon(c);
                setCouponOpen(true);
              }}
            />
            <div className="mt-6 border-t border-slate-200/70" />
          </div>
        </div>
        <div className="lg:hidden mt-6 border-t border-slate-200/70" />

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 pt-6">
          <div>
            <div className="aspect-square w-full rounded-3xl overflow-hidden border border-slate-200 shadow bg-gradient-to-b from-slate-50 to-white">
              <img
                src={thumbs[activeIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pl-1">
              {thumbs.map((src, i) => (
                <Thumb
                  key={`d-${i}`}
                  src={src}
                  active={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                />
              ))}
            </div>
          </div>

          <div className="pt-1">
            {categoryLabel && (
              <div className="text-sky-600 font-semibold">{categoryLabel}</div>
            )}
            <h1 className="mt-1 text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
              {product.name}
            </h1>
            {product.brand && (
              <div className="mt-1 text-sm text-slate-500">
                by {product.brand}
              </div>
            )}

            {/* PRICE BLOCK — compact, clean */}
            <div className="mt-4 flex items-baseline gap-3">
              <PriceText
                valuePaise={price}
                currency={currency}
                strong
                className="text-2xl font-bold"
              />
              {mrp > price && (
                <>
                  <PriceText
                    valuePaise={mrp}
                    currency={currency}
                    strike
                    className="text-base"
                  />
                  {pct !== null && (
                    <span className="text-sm font-semibold text-amber-600">
                      {pct}% Off
                    </span>
                  )}
                </>
              )}
            </div>

            {/* STOCK — quiet, inline */}
            <div
              className={cn(
                "mt-2 flex items-center gap-2 text-sm",
                inStock ? "text-emerald-700" : "text-rose-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full",
                  inStock ? "bg-emerald-500" : "bg-rose-500"
                )}
              />
              {inStock ? "In stock" : "Out of stock"}
            </div>

            {product.shortDescription && (
              <div className="mt-4 text-slate-700 leading-relaxed">
                {product.shortDescription}
              </div>
            )}

            <div className="mt-6 flex items-stretch gap-3">
              <div className="inline-flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-slate-50"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-16 text-center outline-none py-2"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 hover:bg-slate-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                disabled={!inStock}
                onClick={() => addToCart(product, qty)}
                className="flex-1 px-4 rounded-xl bg-slate-900 text-white font-medium shadow hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
            </div>

            <CouponsCarousel
              coupons={coupons}
              onOpen={(c) => {
                setSelectedCoupon(c);
                setCouponOpen(true);
              }}
            />
            <div className="mt-6 border-t border-slate-200/70" />

            <div className="mt-8 hidden lg:block">
              <ProductDetailsCard product={product} />
            </div>
          </div>
        </div>
        <div className="hidden lg:block mt-8 border-t border-slate-200/70" />

        {/* BELOW-THE-FOLD SECTIONS ON DESKTOP */}
        <div className="hidden lg:block mt-10 divide-y divide-slate-200/70">
          <SectionPad bottom>
            <DeliveryInfoCard />
          </SectionPad>
          <SectionPad top>
            <RefundReturnsCard />
          </SectionPad>
        </div>

        {/* MOBILE sections */}
        <div className="lg:hidden mt-8 divide-y divide-slate-200/70">
          <SectionPad bottom>
            <ProductDetailsCard product={product} />
          </SectionPad>
          <SectionPad top bottom>
            <DeliveryInfoCard />
          </SectionPad>
          <SectionPad top>
            <RefundReturnsCard />
          </SectionPad>
        </div>

        {/* ---------- RECOMMENDATIONS ---------- */}
        {(() => {
          const ids = new Set<string>();
          const links =
            (product as unknown as { categoryLinks?: any[] })?.categoryLinks ||
            [];
          for (const l of links) {
            const pid = String(
              l?.parentCategoryId ?? l?.categoryId ?? l?.id ?? ""
            );
            if (pid) ids.add(pid);
          }

          const related = all
            .filter((p) => {
              if (
                !p ||
                String((p as ProductListItem).id) ===
                  String((product as ProductListItem).id)
              )
                return false;
              const cl =
                (p as unknown as { categoryLinks?: any[] })?.categoryLinks ||
                [];
              return cl.some((l) => {
                const pid = String(
                  l?.parentCategoryId ?? l?.categoryId ?? l?.id ?? ""
                );
                return pid && ids.has(pid);
              });
            })
            .filter(
              (p, i, arr) =>
                arr.findIndex(
                  (x) =>
                    String((x as ProductListItem).id) ===
                    String((p as ProductListItem).id)
                ) === i
            )
            .slice(0, 12);

          if (related.length === 0) return null;

          return (
            <>
              <div className="mt-10 border-t border-slate-200/70" />
              <section className="mt-8">
                <div className="flex itemsEnd justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                      Recommended for you
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Similar items you might like
                    </p>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-500">
                    {related.length} item{related.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {related.map((rp) => {
                      const img = getAllImageUrls(rp)[0] || FALLBACK_IMG;
                      const {
                        price: rPrice,
                        mrp: rMrp,
                        pct: rPct,
                      } = computePrice(rp);
                      const rCurrency = rp.currency ?? "INR";
                      const href = `/${storeSlug}/p/${
                        toStr((rp as ProductListItem).slug) ||
                        toStr((rp as ProductListItem).id)
                      }`;

                      return (
                        <Link
                          key={toStr((rp as ProductListItem).id)}
                          to={href}
                          className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-sm transition"
                          aria-label={`Open ${rp.name}`}
                        >
                          <div className="aspect-square w-full bg-slate-50 overflow-hidden">
                            <img
                              src={img}
                              alt={rp.name ?? "Product"}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <div className="px-3 py-2.5">
                            <div className="text-sm font-semibold text-slate-900 line-clamp-2">
                              {rp.name ?? "Product"}
                            </div>
                            <div className="mt-1 flex items-baseline gap-2">
                              <PriceText
                                valuePaise={rPrice}
                                currency={rCurrency}
                                strong
                              />
                              {rMrp > rPrice && (
                                <>
                                  <PriceText
                                    valuePaise={rMrp}
                                    currency={rCurrency}
                                    strike
                                  />
                                  {rPct !== null && (
                                    <span className="text-[11px] font-semibold text-amber-600">
                                      ({rPct}% Off)
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          );
        })()}
        {/* ---------- /RECOMMENDATIONS ---------- */}
      </div>

      {/* Coupon modal */}
      <CouponModal
        open={couponOpen}
        onClose={() => setCouponOpen(false)}
        coupon={selectedCoupon}
      />

      {/* Bottom “Your cart (N)” dock */}
      <CartDock
        checkoutPath={`/${storeSlug}/checkout`}
        bottomOffsetPx={72} // adjust to your footer/nav height
        zIndex={6000}
      />
    </StorefrontLayout>
  );
};

export default ProductDetail;
