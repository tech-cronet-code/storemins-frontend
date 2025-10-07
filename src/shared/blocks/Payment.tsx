/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* =====================================================================================
   Payment Options (enterprise back + address notice)
   - Back: prefer state.from, then history(-1), else /:storeSlug/cart
   - Shows the same "order delivery is managed by Stanlee India..." notice
     under the address section, like on the Cart page
   ===================================================================================== */

type StoredCartItem = {
  id?: string | number;
  name?: string;
  title?: string;
  variant?: string;
  price?: number;
  image?: string;
  qty?: number;
  currency?: string;
  stock?: number;
};
type UiCartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image: string;
  currency?: string;
  stock?: number;
};
type AddressKind = "home" | "work" | "other";
type Address = {
  id: string;
  label: string;
  kind: AddressKind;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: number;
};

const SELECTED_ADDR_KEY = "selected_address_id";

const currencyINR = (v: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v);

function parseStoredArray(raw: string | null): StoredCartItem[] {
  try {
    const arr = raw ? (JSON.parse(raw) as StoredCartItem[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function readCart(): UiCartItem[] {
  const a = parseStoredArray(localStorage.getItem("cart"));
  const map = new Map<string, UiCartItem>();
  for (const it of a) {
    const id = String(it?.id ?? "");
    if (!id) continue;
    map.set(id, {
      id,
      title: (it.title || it.name || "Product").trim(),
      price: Number(it.price ?? 0) || 0,
      qty: Math.max(1, Number(it.qty ?? 1) || 1),
      image: it.image || "",
      currency: it.currency || "INR",
      stock: Number.isFinite(it.stock as number) ? Number(it.stock) : undefined,
    });
  }
  return Array.from(map.values());
}
function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem("customer_addresses");
    if (raw) {
      const arr = JSON.parse(raw) as Address[];
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {
    /* ignore */
  }
  return [
    {
      id: "addr-1",
      label: "Home Raj Nagar",
      kind: "home",
      line1: "a-1301, Raj Nagar Extension",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      postalCode: "201017",
      country: "India",
      isDefault: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "addr-2",
      label: "Work Office",
      kind: "work",
      line1: "9th Floor, Cyber Park",
      line2: "Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      country: "India",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    },
  ];
}
function addressToLine(a: Address) {
  const parts = [a.line1, a.line2, a.city, a.state, a.postalCode].filter(
    Boolean
  );
  return parts.join(", ");
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

  const [items, setItems] = useState<UiCartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setItems(readCart());
    setAddresses(loadAddresses());
    setSelectedAddressId(localStorage.getItem(SELECTED_ADDR_KEY));
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") setItems(readCart());
      if (e.key === "customer_addresses") setAddresses(loadAddresses());
      if (e.key === SELECTED_ADDR_KEY)
        setSelectedAddressId(localStorage.getItem(SELECTED_ADDR_KEY));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );
  const total = subtotal; // delivery fee 0
  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    null;

  const [method, setMethod] = useState<
    "COD" | "UPI" | "CARD" | "WALLET" | "NET"
  >("COD");

  // enterprise back
  const goBackSmart = () => {
    if (fromPath) return navigate(fromPath, { replace: true });
    const canGoBack =
      (window.history.state && (window.history.state as any).idx > 0) ||
      document.referrer !== "";
    if (canGoBack) navigate(-1);
    else navigate(storeSlug ? `/${storeSlug}/cart` : "/", { replace: true });
  };

  const payCOD = () => {
    alert(`Order placed with Cash on Delivery. Amount: ${currencyINR(total)}`);
    if (fromPath) navigate(fromPath, { replace: true });
    else if (storeSlug) navigate(`/${storeSlug}`, { replace: true });
    else navigate("/", { replace: true });
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
                {count} item{count !== 1 ? "s" : ""}. Total:{" "}
                {currencyINR(total)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-2">
        {/* Address + NOTICE (matches Cart) */}
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
                <div className="font-semibold">
                  {selectedAddress ? selectedAddress.label : "Delivery Address"}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {selectedAddress
                    ? addressToLine(selectedAddress)
                    : "Please add/select an address"}
                </div>
                {/* Delivery ETA small line */}
                <div className="mt-2 text-[12px] text-slate-600">
                  Delivery In: <span className="font-medium">12 mins</span>
                </div>
              </div>
            </div>
          </Row>

          {/* ---- THIS is the notice you wanted (same as Cart) ---- */}
          <Divider />
          <div className="px-4 py-3 text-[13px] text-slate-700 leading-6">
            The order delivery is managed by{" "}
            <span className="font-semibold text-slate-900">Stanlee India</span>.{" "}
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
                  className="h-10 px-4 rounded-lg bg-[#1677ff] hover:bg-[#1668e3] text-white text-[13px] font-semibold shadow-sm"
                >
                  Pay {currencyINR(total)} with Cash
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
      <div className="md:hidden fixed left-0 right-0 bottom-0 bg-white border-t border-slate-200 px-3 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[12px] text-slate-600">To Pay</div>
            <div className="text-[18px] font-bold">{currencyINR(total)}</div>
          </div>
          {method === "COD" ? (
            <button
              onClick={payCOD}
              className="h-11 px-4 rounded-xl bg-[#1677ff] hover:bg-[#1668e3] text-white text-[13px] font-semibold shadow-sm"
            >
              Pay {currencyINR(total)} with Cash
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
