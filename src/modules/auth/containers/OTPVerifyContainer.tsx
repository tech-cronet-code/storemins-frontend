import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import OTPVerifyForm from "../components/OTPVerifyForm";
import { useAuth } from "../contexts/AuthContext";
import { useResendOtpMutation } from "../services/authApi";

const OTPVerifyContainer = () => {
  const { user, confirmOtp } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendOtp] = useResendOtpMutation();
  const timerRef = useRef<((duration: number) => void) | null>(null);

  // ✅ This key ensures only one-time timer start
  const OTP_TIMER_STARTED_KEY = "otp_timer_started";

  useEffect(() => {
    if (!user?.mobile) return;
  
    const OTP_TIMER_STARTED_KEY = "otp_timer_started";
    const hasStarted = sessionStorage.getItem(OTP_TIMER_STARTED_KEY);
    const url = new URL(window.location.href);
    const expiresAt = url.searchParams.get("expiresAt");
  
    if (!hasStarted && !expiresAt) {
      const newExpiry = Date.now() + 30000;
      url.searchParams.set("expiresAt", newExpiry.toString());
      window.history.replaceState({}, "", url.toString());
  
      // ✅ Wait until timerRef is available (via polling)
      const waitForTimerRef = setInterval(() => {
        if (timerRef.current) {
          timerRef.current(30);
          sessionStorage.setItem(OTP_TIMER_STARTED_KEY, "true");
          clearInterval(waitForTimerRef);
        }
      }, 100);
    }
  }, [user]);
  

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
      const newExpiry = Date.now() + 30000;
      const url = new URL(window.location.href);
      url.searchParams.set("expiresAt", newExpiry.toString());
      window.history.replaceState({}, "", url.toString());

      await resendOtp({ mobile: user.mobile, userId: user.id }).unwrap();
      toast.success("OTP resent successfully");
      setOtp(["", "", "", ""]);

      timerRef.current?.(30); // restart timer
      sessionStorage.setItem(OTP_TIMER_STARTED_KEY, "true"); // ✅ mark as started
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
      startTimer={(cb) => {
        timerRef.current = cb;
      }}
    />
  );
};

export default OTPVerifyContainer;
