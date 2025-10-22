/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* ===== API hooks (Customer) ===== */
import { useCustomerAuth } from "../../modules/customer/context/CustomerAuthContext";
import {
  useGetActiveCartQuery,
  useUpsertDraftFromCartMutation,
} from "../../modules/customer/services/customerCartApi";
import { usePlaceOrderMutation } from "../../modules/customer/services/customerOrderApi";
import {
  useGetCustomerAddressesQuery,
  CustomerAddress,
} from "../../modules/customer/services/customerApi";

/* =====================================================================================
   Payment Options (Customer)
   - Uses CustomerAuth (NOT SellerAuth) for businessId
   - Header shows real item count and total
   - Address: respects addressId from Cart; falls back to default
   - COD flow: upsert draft with selected address -> place order
   ===================================================================================== */

type AddressKind = "home" | "work" | "other";

const currencyINR = (v: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v);

function addressToLine(a: CustomerAddress) {
  const parts = [a.line1, a.line2, a.city, a.state, a.postalCode].filter(
    Boolean
  );
  return parts.join(", ");
}

/** Fallback resolver to mirror your baseQuery logic */
function resolveBusinessIdFromDOM(): string | null {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="business-id"]'
  );
  if (meta?.content?.trim()) return meta.content.trim();

  const ds =
    document.body?.getAttribute("data-business-id") ||
    document.documentElement?.getAttribute("data-business-id");
  if (ds && ds.trim()) return ds.trim();

  const keys = [
    "businessId",
    "storeBusinessId",
    "shopBusinessId",
    "current_business_id",
  ];
  for (const k of keys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v && v.trim()) return v.trim();
  }
  return null;
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-3">{children}</div>
);
const Divider = ({ dashed }: { dashed?: boolean }) => (
  <div
    className={`border-t ${
      dashed ? "border-dashed border-slate-300" : "border-slate-200/70"
    }`}
  />
);

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeSlug = "" } = useParams<{ storeSlug: string }>();
  const fromPath = (location.state as any)?.from as string | undefined;
  const passedAddressId = (location.state as any)?.addressId as
    | string
    | undefined;

  /* ===== businessId from CustomerAuth (fallback to DOM/localStorage) ===== */
  const auth = (useCustomerAuth() as any) ?? {};
  const ctxBiz: string | undefined =
    auth?.businessId || auth?.userDetails?.storeLinks?.[0]?.businessId;
  const businessId: string =
    (ctxBiz && String(ctxBiz).trim()) || resolveBusinessIdFromDOM() || "";

  /* ===== Active cart (customer) ===== */
  const skipCart = !businessId;
  const { data: activeCart, isFetching: fetchingCart } = useGetActiveCartQuery(
    { businessId },
    { skip: skipCart }
  );

  /* ===== Customer addresses ===== */
  const { data: apiAddresses = [], isFetching: loadingAddresses } =
    useGetCustomerAddressesQuery(undefined, { skip: !businessId });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    passedAddressId ?? null
  );

  // When addresses load, ensure we have a valid selection
  useEffect(() => {
    if (!apiAddresses.length) return;
    const valid =
      selectedAddressId && apiAddresses.some((a) => a.id === selectedAddressId);
    if (valid) return;
    const def = apiAddresses.find((a) => a.isDefault) || apiAddresses[0];
    setSelectedAddressId(def?.id ?? null);
  }, [apiAddresses, selectedAddressId]);

  /* ===== Totals & count from active cart ===== */
  const count =
    activeCart?.items?.reduce((n, i) => n + (i.quantity || 0), 0) ?? 0;
  const total = useMemo(
    () => Number(activeCart?.totals?.grandTotal || 0),
    [activeCart?.totals?.grandTotal]
  );

  const selectedAddress: CustomerAddress | null =
    (selectedAddressId
      ? apiAddresses.find((a) => a.id === selectedAddressId)
      : null) ||
    apiAddresses.find((a) => a.isDefault) ||
    null;

  const [method, setMethod] = useState<
    "COD" | "UPI" | "CARD" | "WALLET" | "NET"
  >("COD");

  const profilePath = storeSlug ? `/${storeSlug}/profile` : "/profile";

  const goBackSmart = () => {
    if (fromPath) return navigate(fromPath, { replace: true });
    const canGoBack =
      (window.history.state && (window.history.state as any).idx > 0) ||
      document.referrer !== "";
    if (canGoBack) navigate(-1);
    else navigate(storeSlug ? `/${storeSlug}/cart` : "/", { replace: true });
  };

  /* ===== Order placement (COD) ===== */
  const [upsertDraft, { isLoading: drafting }] =
    useUpsertDraftFromCartMutation();
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const busy = drafting || placing;

  const payCOD = async () => {
    if (!businessId) {
      alert("Something went wrong: Business not selected.");
      return;
    }
    if (!activeCart?.id || !activeCart?.items?.length) {
      alert("Your cart is empty.");
      return;
    }
    if (!selectedAddress) {
      alert("Please add/select a delivery address.");
      return;
    }

    try {
      // 1️⃣ Ensure draft has the selected address
      const draft = await upsertDraft({
        businessId,
        cartId: activeCart.id,
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
      }).unwrap();

      // 2️⃣ Place order (COD)
      const order = await placeOrder({
        businessId,
        cartId: activeCart.id,
        draftId: draft.draft.id,
        payment: { mode: "COD", provider: "INTERNAL" },
        notes: null,
      }).unwrap();

      // ✅ 3️⃣ Invalidate cache + notify app-wide cart refresh
      window.dispatchEvent(new CustomEvent("cart:update"));
      // Force reload of active cart on next visit
      localStorage.setItem("cart:refresh", "1");

      alert(`Order ${order.orderNumber} placed successfully!`);

      // 4️⃣ Redirect to profile (slug-based)
      navigate(profilePath, { replace: true });
    } catch (e: any) {
      console.error("Order placement failed", e);
      const msg =
        e?.data?.error?.description ||
        e?.data?.message ||
        e?.error ||
        "Failed to place order";
      alert(msg);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f6f7f9]">
      {/* Header */}
      <header className="sticky top-0 z-[2000] bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={goBackSmart}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
              aria-label="Back"
            >
              ←
            </button>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">Payment Options</div>
              <div className="text-[12px] text-slate-500">
                {fetchingCart
                  ? "Loading…"
                  : `${count} item${
                      count !== 1 ? "s" : ""
                    }. Total: ${currencyINR(total)}`}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-2">
        {/* Address + NOTICE */}
        <section className="rounded-2xl bg-white shadow-sm border border-slate-200">
          <Row>
            <div className="flex items-start gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-violet-600"
                fill="currentColor"
              >
                <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
              </svg>
              <div className="text-[13px]">
                <div className="font-semibold flex items-center gap-3">
                  {loadingAddresses
                    ? "Loading address…"
                    : selectedAddress
                    ? selectedAddress.label
                    : "Delivery Address"}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {loadingAddresses
                    ? " "
                    : selectedAddress
                    ? addressToLine(selectedAddress)
                    : "Please add/select an address"}
                </div>
                <div className="mt-2 text-[12px] text-slate-600">
                  Delivery In: <span className="font-medium">12 mins</span>
                </div>
              </div>
            </div>
          </Row>

          <Divider />
          <div className="px-4 py-3 text-[13px] text-slate-700 leading-6">
            The order delivery is managed by{" "}
            <span className="font-semibold text-slate-900">Stanlee India</span>.
            Orders are usually dispatched in{" "}
            <span className="font-semibold">1 day(s)</span>.
          </div>
        </section>

        {/* Pay on Delivery */}
        <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200">
          <Row>
            <div className="text-[15px] font-semibold">Pay on Delivery</div>
          </Row>
          <Divider />
          <div className="px-4 py-3">
            <label
              className={[
                "block rounded-2xl border p-3",
                method === "COD"
                  ? "border-[#1677ff] bg-[#1677ff]/5"
                  : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="method"
                    checked={method === "COD"}
                    onChange={() => setMethod("COD")}
                    className="h-4 w-4 accent-[#1677ff]"
                  />
                  <div>
                    <div className="font-medium text-[14px]">
                      Cash/Pay on Delivery
                    </div>
                    <div className="text-[12px] text-slate-600">
                      Pay cash at the time of delivery.
                    </div>
                  </div>
                </div>

                <button
                  onClick={payCOD}
                  disabled={busy}
                  className="h-10 px-4 rounded-lg bg-[#1677ff] hover:bg-[#1668e3] disabled:opacity-60 text-white text-[13px] font-semibold shadow-sm"
                >
                  {busy ? "Placing…" : `Pay ${currencyINR(total)} with Cash`}
                </button>
              </div>
            </label>
          </div>
        </section>

        {/* UPI */}
        <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200">
          <Row>
            <div className="flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
                alt="UPI"
                className="h-5"
              />
              <div className="text-[15px] font-semibold">
                Pay by any UPI App
              </div>
            </div>
          </Row>
          <Divider />
          <div className="px-4 py-3">
            <label
              className={[
                "block rounded-2xl border p-3",
                method === "UPI"
                  ? "border-[#1677ff] bg-[#1677ff]/5"
                  : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="method"
                    checked={method === "UPI"}
                    onChange={() => setMethod("UPI")}
                    className="h-4 w-4 accent-[#1677ff]"
                  />
                  <div className="text-[14px]">
                    <div className="font-medium">Add New UPI ID</div>
                    <div className="text-[12px] text-slate-600">
                      You need to have a registered UPI ID
                    </div>
                  </div>
                </div>
                <button
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
                  aria-label="Add UPI"
                >
                  +
                </button>
              </div>
            </label>
          </div>
        </section>

        {/* Cards */}
        <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200">
          <Row>
            <div className="text-[15px] font-semibold">
              Credit & Debit Cards
            </div>
          </Row>
          <Divider />
          <div className="px-4 py-3">
            <label
              className={[
                "block rounded-2xl border p-3",
                method === "CARD"
                  ? "border-[#1677ff] bg-[#1677ff]/5"
                  : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="method"
                    checked={method === "CARD"}
                    onChange={() => setMethod("CARD")}
                    className="h-4 w-4 accent-[#1677ff]"
                  />
                  <div className="text-[14px]">
                    <div className="font-medium">Add New Card</div>
                    <div className="text-[12px] text-slate-600">
                      Save and Pay via Cards.
                    </div>
                  </div>
                </div>
                <button
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
                  aria-label="Add Card"
                >
                  +
                </button>
              </div>
            </label>
          </div>
        </section>

        {/* More Payment Options */}
        <section className="mt-3 rounded-2xl bg-white shadow-sm border border-slate-200">
          <Row>
            <div className="text-[15px] font-semibold">
              More Payment Options
            </div>
          </Row>
          <Divider />
          <button
            onClick={() => setMethod("WALLET")}
            className={[
              "w-full text-left px-4 py-3 flex items-center justify-between",
              method === "WALLET" ? "bg-[#1677ff]/5" : "bg-white",
            ].join(" ")}
          >
            <div>
              <div className="font-medium text-[14px]">Wallets</div>
              <div className="text-[12px] text-slate-600">
                PhonePe, Amazon Pay & more
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>
          <Divider />
          <button
            onClick={() => setMethod("NET")}
            className={[
              "w-full text-left px-4 py-3 flex items-center justify-between",
              method === "NET" ? "bg-[#1677ff]/5" : "bg-white",
            ].join(" ")}
          >
            <div>
              <div className="font-medium text-[14px]">Netbanking</div>
              <div className="text-[12px] text-slate-600">
                Select from a list of banks
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>
        </section>

        <div className="h-24 md:hidden" />
      </main>

      {/* Bottom sticky pay bar (mobile) */}
      <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-slate-200 px-3 py-2 md:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[12px] text-slate-600">To Pay</div>
            <div className="text-[18px] font-bold">{currencyINR(total)}</div>
          </div>
          {method === "COD" ? (
            <button
              onClick={payCOD}
              disabled={busy}
              className="h-11 px-4 rounded-xl bg-[#1677ff] hover:bg-[#1668e3] disabled:opacity-60 text-white text-[13px] font-semibold shadow-sm"
            >
              {busy ? "Placing…" : `Pay ${currencyINR(total)} with Cash`}
            </button>
          ) : (
            <button
              onClick={() => alert(`Continue with ${method} (mock)`)}
              className="h-11 px-4 rounded-xl bg-[#1677ff] hover:bg-[#1668e3] text-white text-[13px] font-semibold shadow-sm"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
