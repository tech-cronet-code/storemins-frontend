// src/pages/CartDetail.tsx
import { useMemo, useRef, useState } from "react";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../../customer/components/CustomerLayout";
import { CartProduct } from "../components/CartItem";
import CartItemsSection from "../components/CartItemsSection";
import CartSummary from "../components/CartSummary";
import PaymentMethods, { PaymentMethod } from "../components/PaymentMethods";
import ShippingForm from "../components/ShippingForm";
import Stepper from "../components/Stepper";

const initialCart: CartProduct[] = [
  {
    id: "prod-1",
    name: "Floral Print Bollywood Lycra Blend Saree (Maroon, Black)",
    imageUrl: "https://via.placeholder.com/120x120?text=Img",
    price: 10000,
    originalPrice: 20000,
    size: "30",
    color: { id: "red", name: "Red", hex: "#b91c1c" },
    quantity: 1,
  },
  {
    id: "prod-2",
    name: "Casual Cotton Kurta Set",
    imageUrl: "https://via.placeholder.com/120x120?text=Img",
    price: 799,
    originalPrice: undefined,
    size: "M",
    color: { id: "green", name: "Green", hex: "#059669" },
    quantity: 2,
  },
];

export default function CartDetail() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cart, setCart] = useState<CartProduct[]>(initialCart);
  const [method, setMethod] = useState<PaymentMethod>("cod");

  // 1) ref to the left‐pane container
  const leftPaneRef = useRef<HTMLDivElement>(null);

  // ─── Cart handlers ─────────────────────────
  const handleQuantity = (id: string, qty: number) =>
    setCart((c) => c.map((p) => (p.id === id ? { ...p, quantity: qty } : p)));
  const handleSize = (id: string, size: string | number) =>
    setCart((c) => c.map((p) => (p.id === id ? { ...p, size } : p)));
  const handleColor = (id: string, color: CartProduct["color"]) =>
    setCart((c) => c.map((p) => (p.id === id ? { ...p, color } : p)));
  const handleRemove = (id: string) =>
    setCart((c) => c.filter((p) => p.id !== id));

  // ─── Totals ───────────────────────────────────
  const { subtotal, originalSubtotal, fee, taxPercent } = useMemo(() => {
    const sub = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const orig = cart.reduce(
      (sum, p) =>
        sum +
        (p.originalPrice != null
          ? p.originalPrice * p.quantity
          : p.price * p.quantity),
      0
    );
    return { subtotal: sub, originalSubtotal: orig, fee: 50, taxPercent: 5 };
  }, [cart]);

  // ─── 2) advance step & scroll into view ────────────────────────
  const goNext = () => {
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
    leftPaneRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div className="py-8 w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stepper */}
          <Stepper current={step} />

          <div className="mt-6 flex flex-col lg:flex-row gap-8">
            {/* ─── LEFT PANE ─────────────────────────── */}
            <div ref={leftPaneRef} className="flex-1 space-y-6">
              {step === 1 && (
                <CartItemsSection
                  cart={cart}
                  onChangeQuantity={handleQuantity}
                  onChangeSize={handleSize}
                  onChangeColor={handleColor}
                  onRemove={handleRemove}
                  subtotal={subtotal}
                  originalSubtotal={originalSubtotal}
                  fee={fee}
                  taxPercent={taxPercent}
                />
              )}

              {step === 2 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Shipping address</h2>
                    <button
                      onClick={() => {
                        setStep(1);
                        leftPaneRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-50"
                    >
                      ← Back to Cart
                    </button>
                  </div>
                  <ShippingForm />
                </div>
              )}

              {step === 3 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Choose payment mode
                    </h2>
                    <button
                      onClick={() => {
                        setStep(2);
                        leftPaneRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-50"
                    >
                      ← Back to Address
                    </button>
                  </div>
                  <PaymentMethods
                    selected={method}
                    onSelect={setMethod}
                    onPlaceOrder={() => alert("✅ Order placed!")}
                  />
                </div>
              )}
            </div>

            {/* ─── RIGHT PANE ────────────────────────── */}
            <div className="w-full lg:w-[360px] flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <CartSummary
                  subtotal={subtotal}
                  originalSubtotal={originalSubtotal}
                  fee={fee}
                  taxPercent={taxPercent}
                  // only show Continue on steps 1 & 2, scroll left on each click
                  onContinue={step < 3 ? goNext : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
