import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StorefrontLayout from "./StorefrontLayout";

import {
  ProductListItem,
  useListProductsQuery,
} from "../../modules/auth/services/productApi";
import { convertPath } from "../../modules/auth/utils/useImagePath";
import { useAuth } from "../../modules/auth/contexts/AuthContext";

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
}> = ({ valuePaise, currency = "INR", strike = false, strong = false }) => {
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
        strike && "line-through text-slate-400",
        strong && "font-semibold text-slate-900"
      )}
    >
      {formatted}
    </span>
  );
};

function computePrice(p?: ProductLike) {
  if (!p) return { price: 0, mrp: 0, pct: null as number | null };
  const price = toPaise(
    p.discountedPrice ??
      p.salePrice ??
      p.finalPrice ??
      p.currentPrice ??
      p.price
  );
  let mrp = toPaise(
    p.mrp ?? p.listPrice ?? p.originalPrice ?? p.compareAtPrice ?? p.strikePrice
  );

  let pct: number | null = null;
  if (mrp > price && price > 0) {
    pct = Math.max(0, Math.min(100, Math.round(((mrp - price) / mrp) * 100)));
  } else if (price > 0 && mrp === 0) {
    mrp = Math.round(price * 1.25);
    pct = Math.max(0, Math.min(100, Math.round(((mrp - price) / mrp) * 100)));
  }
  return { price, mrp, pct };
}

/* ------------------------------ component ------------------------------ */
const ProductDetail: React.FC = () => {
  // Route params: /:storeSlug/p/:productSlug
  const { storeSlug = "", productSlug = "" } = useParams<{
    storeSlug?: string;
    productSlug?: string;
  }>();

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

  if (!productSlug) return <div className="p-6">Missing product slug.</div>;
  if (skip) return <div className="p-6">No business connected.</div>;
  if (anyFetching && !product) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const images = getAllImageUrls(product);
  const { price, mrp, pct } = computePrice(product);
  const currency = product.currency ?? "INR";
  const inStock =
    product.isInStock ??
    (typeof product.stock === "number" ? (product.stock ?? 0) > 0 : true);

  function addToCart(p: ProductLike, quantity: number) {
    try {
      type CartItem = {
        id: ProductListItem["id"];
        name: string;
        price: number | string | null | undefined;
        image: string;
        qty: number;
        currency: string;
      };

      const raw = localStorage.getItem("cart");
      const cart: CartItem[] = raw ? (JSON.parse(raw) as CartItem[]) : [];
      const idx = cart.findIndex(
        (x) => toStr(x.id) === toStr((p as ProductListItem).id)
      );
      const imageUrl = images[0] ?? FALLBACK_IMG;

      if (idx > -1) {
        cart[idx].qty += quantity;
      } else {
        cart.push({
          id: (p as ProductListItem).id,
          name: p.name ?? "Product",
          price: p.discountedPrice ?? p.price ?? p.finalPrice ?? p.currentPrice,
          image: imageUrl,
          qty: quantity,
          currency: p.currency ?? "INR",
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(
        new CustomEvent("cart:add", {
          detail: { id: (p as ProductListItem).id, qty: quantity },
        })
      );
    } catch {
      /* ignore */
    }
  }

  function buyNow(p: ProductLike, quantity: number) {
    addToCart(p, quantity);
    try {
      window.dispatchEvent(new CustomEvent("cart:open"));
    } catch {
      /* ignore */
    }
  }

  return (
    <StorefrontLayout
      businessId={businessId}
      headerSettings={{ forceMenu: true, hideMenuOnDetail: false }}
      footerSettings={{}}
    >
      <div className="max-w-6xl mx-auto py-6 lg:py-10 px-3 sm:px-5 lg:px-8 bg-transparent">
        {/* Back to store: always /:storeSlug */}
        <div className="mb-4 text-sm text-slate-500">
          <Link
            to={storeSlug ? `/${storeSlug}` : ".."}
            className="hover:underline"
          >
            ← Back to store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <img
                src={images[activeIdx] ?? FALLBACK_IMG}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border transition",
                      i === activeIdx
                        ? "border-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">
              {product.name}
            </h1>
            {product.brand && (
              <div className="mt-1 text-sm text-slate-500">
                by {product.brand}
              </div>
            )}

            <div className="mt-4 flex items-baseline gap-3">
              <PriceText valuePaise={price} currency={currency} strong />
              {mrp > price && (
                <>
                  <PriceText valuePaise={mrp} currency={currency} strike />
                  {pct !== null && (
                    <span className="text-xs font-semibold text-amber-600">
                      ({pct}% Off)
                    </span>
                  )}
                </>
              )}
            </div>

            <div
              className={cn(
                "mt-2 text-sm",
                inStock ? "text-emerald-700" : "text-rose-600"
              )}
            >
              {inStock ? "In stock" : "Out of stock"}
            </div>

            {product.shortDescription && (
              <div className="mt-4 text-slate-700 text-sm leading-relaxed">
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
                className="flex-1 px-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
              <button
                disabled={!inStock}
                onClick={() => buyNow(product, qty)}
                className="flex-1 px-4 rounded-xl border border-slate-300 font-medium hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Buy now"
              >
                Buy Now
              </button>
            </div>

            {(product.attributes?.length || product.specs) && (
              <div className="mt-8">
                <div className="text-sm font-semibold text-slate-900 mb-3">
                  Specifications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.attributes?.map((a, i) =>
                    a?.name ? (
                      <div
                        key={`attr-${i}`}
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                      >
                        <div className="text-slate-500">{a.name}</div>
                        <div className="font-medium text-slate-800">
                          {a.value ?? "-"}
                        </div>
                      </div>
                    ) : null
                  )}
                  {product.specs &&
                    (
                      Object.entries(product.specs) as Array<[string, unknown]>
                    ).map(([k, v]) => (
                      <div
                        key={`spec-${k}`}
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                      >
                        <div className="text-slate-500">{k}</div>
                        <div className="font-medium text-slate-800">
                          {String(v ?? "-")}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="mt-8">
                <div className="text-sm font-semibold text-slate-900 mb-2">
                  About this item
                </div>
                <div className="prose prose-sm max-w-none text-slate-700">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
