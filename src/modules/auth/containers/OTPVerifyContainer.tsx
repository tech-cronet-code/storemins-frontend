import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import OTPVerifyForm from "../components/OTPVerifyForm";
import { useResendOtpMutation } from "../services/authApi";
import { useSellerAuth } from "../contexts/SellerAuthContext";

const OTPVerifyContainer = () => {
  const { user, confirmOtp, logout } = useSellerAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [expiresAt, setExpiresAt] = useState<string | null>(null); // ✅ Track expiresAt
  const [resendOtp] = useResendOtpMutation();

  const timerFnRef = useRef<((duration: number) => void) | null>(null);

  useEffect(() => {
    console.log("✅ OTPVerifyContainer loaded");

    const stored = sessionStorage.getItem("otpExpiresAt");

    console.log(stored, "stored");

    const now = Date.now();

    let validExpiry = null;

    if (stored) {
      const storedTime = new Date(stored).getTime();
      if (storedTime > now) {
        validExpiry = stored;
        // console.log("✅ Using valid session expiry:", stored);
      } else {
        // console.log("❌ Stored expiry is expired:", stored);
      }
    }

    if (!validExpiry) {
      const freshExpiry = new Date(now + 30 * 1000).toISOString();
      console.log(freshExpiry, "freshExpiry");

      sessionStorage.setItem("otpExpiresAt", freshExpiry);
      validExpiry = freshExpiry;
      // console.log("🆕 Fresh expiry set:", freshExpiry);
    }

    setExpiresAt(validExpiry);

    setTimeout(() => {
      if (timerFnRef.current && validExpiry) {
        const remaining =
          Math.floor(new Date(validExpiry).getTime() - Date.now()) / 1000;
        // console.log("⏱ Starting timer for", remaining, "seconds");
        if (remaining > 0) {
          timerFnRef.current(Math.floor(remaining));
        }
      }
    }, 50);
  }, []);

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length < 4) {
      toast.error("Please enter full OTP");
      return;
    }
    confirmOtp(code);
    setOtp(["", "", "", ""]);
    document.getElementById("otp-0")?.focus();
  };

  const handleResend = async () => {
    if (!user?.mobile) {
      toast.error("Mobile number not found");
      return;
    }

    try {
      const res = await resendOtp({
        mobile: user.mobile,
        userId: user.id,
      }).unwrap();
      toast.success(res.message);
      setOtp(["", "", "", ""]);

      sessionStorage.setItem("otpExpiresAt", res.expiresAt); // ✅ Store new expiry
      setExpiresAt(res.expiresAt); // ✅ Update state
      const newExpiresAt = new Date(res.expiresAt);
      sessionStorage.setItem("otpExpiresAt", res.expiresAt); // ✅ Save new one
      const remaining = Math.floor(
        (newExpiresAt.getTime() - Date.now()) / 1000
      );
      if (remaining > 0) {
        timerFnRef.current?.(remaining);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  // ✅ FIX: Add this return
  return (
    <OTPVerifyForm
      otp={otp}
      setOtp={setOtp}
      onSubmit={handleSubmit}
      onResend={handleResend}
      expiresAt={expiresAt}
      startTimer={(fn) => {
        timerFnRef.current = fn;
      }}
      logout={logout}
    />
  );
};

export default OTPVerifyContainer;
