// src/app/components/CustomerLoginModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useCustomerLoginInitMutation,
  useCustomerRegisterMutation,
  useCustomerConfirmOtpMutation,
  useCustomerResendOtpMutation,
  JwtResponseDto,
} from "../../modules/customer/services/customerApi";
import { AppDispatch } from "../../common/state/store";
import { UserRoleName } from "../../modules/auth/constants/userRoles";
import { loginSuccess } from "../../modules/auth/slices/customerAuthSlice";

/**
 * CustomerLoginModal.tsx — OTP-first flow (Login → Create → Verify → Access)
 */

type Step = "login" | "create" | "verify";

const Spinner = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-80"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
    />
  </svg>
);

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className={[
      "w-full rounded-2xl border px-4 py-3 text-[15px] outline-none transition",
      "border-slate-200 bg-white focus:ring-4",
      "focus:ring-violet-100 focus:border-violet-400",
      props.className || "",
    ].join(" ")}
  />
);

const PrimaryBtn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ children, disabled, loading, ...rest }) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={[
      "w-full rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide shadow-sm transition inline-flex items-center justify-center gap-2",
      disabled || loading
        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
        : "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800",
    ].join(" ")}
  >
    {loading && <Spinner className="h-4 w-4" />} {children}
  </button>
);

const GhostBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...rest
}) => (
  <button
    {...rest}
    className="px-3 py-1.5 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
  >
    {children}
  </button>
);

const IndiaFlag = ({ className = "h-4 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 3 2" className={className} aria-hidden>
    <rect width="3" height="2" fill="#fff" />
    <rect width="3" height="0.6667" y="0" fill="#FF9933" />
    <rect width="3" height="0.6667" y="1.3333" fill="#138808" />
    <circle cx="1.5" cy="1" r="0.23" fill="#000080" />
  </svg>
);

function PhoneFieldIN({
  value,
  onChange,
  placeholder,
  onKeyDown,
  autoFocus,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center rounded-2xl border text-[15px] transition",
        "border-slate-200 bg-white focus-within:ring-4",
        "focus-within:ring-violet-100 focus-within:border-violet-400",
        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="pl-3 pr-2 flex items-center gap-2 select-none">
        <IndiaFlag />
        <span className="text-slate-700 font-medium">+91</span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        autoFocus={autoFocus}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none px-2 py-3"
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
        }
        onKeyDown={onKeyDown}
        autoComplete="tel"
      />
    </div>
  );
}

const CardShell: React.FC<
  React.PropsWithChildren<{
    onCancel: () => void;
    title: string;
    subtitle?: string;
  }>
> = ({ onCancel, title, subtitle, children }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShown(true), 10);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(root.querySelectorAll<HTMLElement>(q)).filter(
      (el) => !el.hasAttribute("disabled")
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusables.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={rootRef}
      className={[
        "relative w-full max-w-2xl mx-auto max-h-[85vh]",
        "transition duration-200",
        shown ? "opacity-100 scale-100" : "opacity-0 scale-[0.985]",
      ].join(" ")}
      role="document"
      aria-label={title}
    >
      <div className="absolute -inset-x-8 -bottom-10 h-24 blur-2xl bg-black/10 rounded-[100%] pointer-events-none" />
      <div className="absolute -top-3 left-5 right-5 h-3 rounded-t-2xl bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      <div className="rounded-3xl bg-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.28)] ring-1 ring-slate-900/10 overflow-auto">
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full grid place-items-center text-white bg-violet-600 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">
                {title}
              </div>
              {subtitle && (
                <div className="text-xs text-slate-500 leading-tight">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          <GhostBtn onClick={onCancel}>Cancel</GhostBtn>
        </div>

        <div className="px-6 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
};

/* ============================== Pages ============================== */

const LoginPage: React.FC<{
  onDone: (exists: boolean, phone: string) => void;
  goCreate: (phone: string) => void;
}> = ({ onDone, goCreate }) => {
  const [phone, setPhone] = useState("");
  const [loginInit, { isLoading }] = useCustomerLoginInitMutation();

  const can = phone.replace(/\D/g, "").length === 10;

  const start = async () => {
    if (!can) return;
    const res = await loginInit({ mobile: phone }).unwrap();
    if (!res.id) {
      goCreate(phone);
      return;
    }
    onDone(true, phone); // account exists → ALWAYS OTP
  };

  return (
    <>
      <div className="mt-1 mb-4">
        <PhoneFieldIN
          value={phone}
          onChange={setPhone}
          placeholder="Mobile Number *"
          autoFocus
        />
      </div>
      <PrimaryBtn onClick={start} disabled={!can} loading={isLoading}>
        Continue
      </PrimaryBtn>
      <p className="mt-3 text-center text-xs text-slate-600">
        We’ll send an OTP to this number
      </p>
      <DemoNote />
    </>
  );
};

const CreateAccountPage: React.FC<{
  phone: string;
  onCreated: () => void;
  onBack: () => void;
}> = ({ phone, onCreated, onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [register, { isLoading }] = useCustomerRegisterMutation();

  const can = !!name.trim();

  const submit = async () => {
    if (!can) return;
    await register({
      name: name.trim(),
      mobile: phone,
      email: email.trim() || undefined,
      isTermAndPrivarcyEnable: true,
    }).unwrap();
    onCreated();
  };

  return (
    <>
      <div className="mt-1 space-y-3">
        <div className="opacity-90">
          <PhoneFieldIN
            value={phone}
            onChange={() => {}}
            disabled
            placeholder=""
          />
        </div>
        <Field
          placeholder="Email address (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <PrimaryBtn onClick={submit} disabled={!can} loading={isLoading}>
          Verify details
        </PrimaryBtn>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-600 hover:text-violet-700"
        >
          Back
        </button>
      </div>
      <DemoNote />
    </>
  );
};

const VerifyOtpPage: React.FC<{
  phone: string;
  onAccess: (tokens: JwtResponseDto) => void;
}> = ({ phone, onAccess }) => {
  // store 4 characters (digits or letters)
  const [chars, setChars] = useState<string[]>(Array(4).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [confirmOtp, { isLoading }] = useCustomerConfirmOtpMutation();
  const [resendOtp] = useCustomerResendOtpMutation();

  const [err, setErr] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(29);

  useEffect(() => {
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const code = useMemo(() => chars.join(""), [chars]);
  // allow either 4 digits OR the test prefix "AAAA" (any case)
  const normalized = code.toUpperCase();
  const can =
    normalized.length === 4 &&
    (/^\d{4}$/.test(normalized) || normalized.startsWith("AAAA"));

  const onKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
    if (e.key === "Enter" && can) submit();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clip = (e.clipboardData.getData("text") || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4);
    if (!clip) return;
    const arr = Array(4).fill("");
    for (let i = 0; i < clip.length && i < 4; i++) arr[i] = clip[i];
    setChars(arr);
    inputs.current[Math.min(clip.length, 3)]?.focus();
  };

  const onChange = (idx: number, val: string) => {
    // allow a single alphanumeric char; uppercase for consistency
    const ch = (val || "").toUpperCase().slice(-1);
    const ok = /^[A-Z0-9]$/.test(ch);
    setChars((prev) => {
      const next = [...prev];
      next[idx] = ok ? ch : "";
      return next;
    });
    if (ok && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const submit = async () => {
    if (!can || isLoading) return;
    setErr(null);
    try {
      // BE returns JwtResponseDto (access in body, refresh cookie set by server)
      const tokens = await confirmOtp({
        mobile: phone,
        confirm_mobile_otp_code: code, // can be "1234" or "AAAA"
      }).unwrap();
      onAccess(tokens);
    } catch {
      setErr("Invalid or expired OTP. Try again.");
    }
  };

  const resend = async () => {
    if (resendIn > 0) return;
    const r = await resendOtp({ mobile: phone }).unwrap();
    const secs = Math.max(
      0,
      Math.min(
        59,
        Math.round((new Date(r.expiresAt).getTime() - Date.now()) / 1000)
      )
    );
    setResendIn(secs);
  };

  return (
    <>
      <div className="text-sm text-slate-600 mb-2">
        Enter OTP sent to <b>+91 {phone}</b>
      </div>

      <div className="flex justify-center gap-2 sm:gap-3 my-4">
        {chars.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="text"
            pattern="[A-Za-z0-9]*"
            className={[
              "w-12 h-12 sm:w-12 sm:h-12 rounded-xl border text-center text-lg sm:text-xl font-medium",
              "border-slate-300 focus:outline-none focus:ring-4",
              "focus:ring-violet-100 focus:border-violet-400",
            ].join(" ")}
            value={d}
            onKeyDown={(e) => onKey(i, e)}
            onChange={(e) => onChange(i, e.target.value)}
            onPaste={i === 0 ? onPaste : undefined}
            maxLength={1}
          />
        ))}
      </div>

      <PrimaryBtn onClick={submit} disabled={!can} loading={isLoading}>
        Verify
      </PrimaryBtn>

      <div className="mt-3 text-center text-xs text-slate-600">
        Didn’t receive OTP?{" "}
        {resendIn > 0 ? (
          <span>Re-send in 00:{String(resendIn).padStart(2, "0")}</span>
        ) : (
          <button
            onClick={resend}
            className="font-medium hover:underline text-violet-700"
          >
            Re-send
          </button>
        )}
      </div>

      {err && (
        <div className="mt-3 text-center text-xs text-red-600">{err}</div>
      )}

      <div className="mt-4 text-center text-[11px] text-slate-500">
        Test OTP: <b>1234</b> or <b>AAAA</b>
      </div>
    </>
  );
};

const DemoNote: React.FC = () => (
  <div className="mt-4 text-center text-[11px] text-slate-400">
    Demo users: <b>9898250110</b> (Raj, registered) · <b>7874264945</b> (new).
    Test OTP: <b>1234</b> or <b>AAAA</b>
  </div>
);

/* ============================== Main Modal ============================== */

const PERSIST_KEY = "customer_login_modal_state";

export default function CustomerLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState<string>("");

  // body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // hydrate
  useEffect(() => {
    if (!open) return;
    try {
      const raw = sessionStorage.getItem(PERSIST_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.step) setStep(saved.step);
        if (saved.phone) setPhone(saved.phone);
      }
    } catch {
      /* noop */
    }
  }, [open]);

  // persist
  useEffect(() => {
    if (!open) return;
    sessionStorage.setItem(PERSIST_KEY, JSON.stringify({ step, phone }));
  }, [open, step, phone]);

  const onAccess = (tokens: JwtResponseDto) => {
    const roles = (tokens.role || []) as UserRoleName[];
    dispatch(
      loginSuccess({
        user: {
          id: tokens.id,
          name: tokens.name || "",
          mobile: tokens.mobile,
          role: roles,
          permissions: tokens.permissions || [],
          mobile_confirmed: tokens.mobile_confirmed ?? true,
        },
        token: tokens.access_token,
        refreshToken: "", // refresh token stays in HttpOnly cookie
      })
    );
    sessionStorage.removeItem(PERSIST_KEY);
    onClose();
    window.location.href = "/profile";
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[1000]
        bg-transparent
        backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-saturate-125
        flex items-center justify-center
        p-4 sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_55%)]" />
      <CardShell
        onCancel={onClose}
        title={
          step === "login"
            ? "Login"
            : step === "create"
            ? "Create Account"
            : "Verify OTP"
        }
        subtitle={
          step === "verify"
            ? "Confirm mobile number using the OTP"
            : "Login or Signup to continue"
        }
      >
        {step === "login" && (
          <LoginPage
            onDone={(exists, p) => {
              setPhone(p);
              setStep("verify");
            }}
            goCreate={(p) => {
              setPhone(p);
              setStep("create");
            }}
          />
        )}

        {step === "create" && (
          <CreateAccountPage
            phone={phone}
            onCreated={() => setStep("verify")}
            onBack={() => setStep("login")}
          />
        )}

        {step === "verify" && (
          <VerifyOtpPage phone={phone} onAccess={onAccess} />
        )}
      </CardShell>
    </div>
  );
}
