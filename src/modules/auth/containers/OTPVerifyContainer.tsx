import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import OTPVerifyForm from "../components/OTPVerifyForm";
import { useResendOtpMutation } from "../services/sellerApi";
import { useSellerAuth } from "../contexts/SellerAuthContext";

const OTPVerifyContainer = () => {
  const { user, confirmOtp, logout } = useSellerAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [resendOtp] = useResendOtpMutation();

  const timerFnRef = useRef<((duration: number) => void) | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("otpExpiresAt");
    const now = Date.now();
    let validExpiry: string | null = null;

    if (stored) {
      const storedTime = new Date(stored).getTime();
      if (storedTime > now) validExpiry = stored;
    }

    if (!validExpiry) {
      const freshExpiry = new Date(now + 30 * 1000).toISOString();
      sessionStorage.setItem("otpExpiresAt", freshExpiry);
      validExpiry = freshExpiry;
    }

    setExpiresAt(validExpiry);

    setTimeout(() => {
      if (timerFnRef.current && validExpiry) {
        const remaining =
          Math.floor(new Date(validExpiry).getTime() - Date.now()) / 1000;
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
    confirmOtp(code).catch((e: any) => {
      toast.error(e?.message || "OTP verification failed");
    });
    setOtp(["", "", "", ""]);
    document.getElementById("otp-0")?.focus();
  };

  const handleResend = async () => {
    const pendingMobile =
      sessionStorage.getItem("seller_pending_mobile") || undefined;
    const pendingUserId =
      sessionStorage.getItem("seller_pending_user_id") || undefined;

    const mobileToUse = user?.mobile || pendingMobile;
    const userIdToUse = user?.id || pendingUserId;

    if (!mobileToUse) {
      toast.error("Mobile number not found");
      return;
    }

    try {
      const res = await resendOtp({
        mobile: mobileToUse,
        userId: userIdToUse,
      }).unwrap();
      toast.success(res.message);
      setOtp(["", "", "", ""]);

      sessionStorage.setItem("otpExpiresAt", res.expiresAt);
      setExpiresAt(res.expiresAt);

      const newExpiresAt = new Date(res.expiresAt);
      const remaining = Math.floor(
        (newExpiresAt.getTime() - Date.now()) / 1000
      );
      if (remaining > 0) {
        timerFnRef.current?.(remaining);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

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
