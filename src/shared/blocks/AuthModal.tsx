import React, { useEffect, useRef, useState } from "react";

type Mode = "signin" | "signup";

export interface AuthModalProps {
  open: boolean;
  mode?: Mode;
  onClose: () => void;
  onModeChange?: (m: Mode) => void;
  onRequestOtp?: (payload: {
    mode: Mode;
    name?: string;
    phone: string;
  }) => void;
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

const isValidPhone = (raw: string) => {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  mode: extMode = "signin",
  onClose,
  onModeChange,
  onRequestOtp,
}) => {
  const [mode, setMode] = useState<Mode>(extMode);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useLockBodyScroll(open);

  useEffect(() => setMode(extMode), [extMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, mode, onClose]);

  if (!open) return null;

  const canSubmit =
    mode === "signin"
      ? isValidPhone(phone)
      : !!name.trim() && isValidPhone(phone);

  const switchMode = (m: Mode) => {
    setMode(m);
    onModeChange?.(m);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const requestOtp = () => {
    if (!canSubmit) return;
    onRequestOtp?.({
      mode,
      name: mode === "signup" ? name.trim() : undefined,
      phone,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-3 sm:p-4 md:p-8"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute right-3 top-3 h-8 w-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M6 6l12 12M18 6l-12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        <div className="px-5 pt-6 pb-2 text-center">
          <div className="text-lg font-semibold text-slate-900">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </div>
        </div>

        <div className="px-5 pb-5">
          {mode === "signup" && (
            <div className="mb-3">
              <input
                ref={firstFieldRef}
                type="text"
                placeholder="Your Name *"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="mb-3">
              <input
                ref={firstFieldRef}
                type="tel"
                placeholder="Mobile Number *"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          )}

          {mode === "signup" && (
            <div className="mb-3">
              <input
                type="tel"
                placeholder="Mobile Number *"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          )}

          <button
            type="button"
            disabled={!canSubmit}
            onClick={requestOtp}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold tracking-wide ${
              canSubmit
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            REQUEST OTP
          </button>

          <div className="mt-4 text-center text-sm text-slate-700">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-emerald-700 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="text-emerald-700 font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
