// SignInUpModal.tsx

import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

interface SignInUpModalProps {
  open: boolean;
  onClose: () => void;
}

const isValidMobile = (m: string) => {
  // simple 10-digit check; adapt as needed
  return /^\d{10}$/.test(m);
};

const SignInUpModal: React.FC<SignInUpModalProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // close on outside click or Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onClickOutside(e: MouseEvent) {
      if (
        open &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  // reset when closed
  useEffect(() => {
    if (!open) {
      setMode("signup");
      setName("");
      setMobile("");
      setOtpRequested(false);
      setOtpSent(false);
      setLoading(false);
      setError(null);
    }
  }, [open]);

  const canRequestOtp =
    (mode === "signup" ? name.trim().length > 0 : true) &&
    isValidMobile(mobile);

  const handleRequestOtp = () => {
    if (!canRequestOtp) return;
    setError(null);
    setLoading(true);
    // simulate API
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpRequested(true);
    }, 1000);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div
            ref={(el) => (modalRef.current = el)}
            className="relative w-full max-w-sm rounded-xl bg-white shadow-2xl overflow-hidden animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {mode === "signup" ? "Sign Up" : "Sign In"}
              </h2>
              <button
                aria-label="Close"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <IoClose size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="mobile"
                  className="block text-xs font-medium text-gray-700"
                >
                  Mobile Number *
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>

              {otpSent && (
                <div className="text-green-600 text-sm">
                  OTP sent to <span className="font-medium">{mobile}</span>. You
                  can enter it to verify.
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                disabled={!canRequestOtp || loading}
                onClick={handleRequestOtp}
                className={`w-full rounded-md px-4 py-3 font-semibold transition ${
                  canRequestOtp
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } flex justify-center items-center gap-2`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : null}
                <span>{mode === "signup" ? "REQUEST OTP" : "REQUEST OTP"}</span>
              </button>

              <div className="text-center text-sm">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("signin")}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes (if Tailwind config doesn't include it) */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        `}
      </style>
    </>
  );
};

export default SignInUpModal;
