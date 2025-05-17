import React, { useEffect, useRef, useState } from "react";

interface Props {
  otp: string[];
  setOtp: (otp: string[]) => void;
  onSubmit: () => void;
  onResend: () => void;
  expiresAt?: string | null;
  startTimer?: (fn: (duration: number) => void) => void; // ✅ Here
  logout: () => void;
}

const OTPVerifyForm: React.FC<Props> = ({
  otp,
  setOtp,
  onSubmit,
  onResend,
  expiresAt,
  startTimer,
  logout,
}) => {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startCountdown = (duration: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    console.log(duration, "durationdurationduration");

    setTimer(duration); // ✅ Show countdown immediately

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🆕 Start countdown based on expiresAt prop on initial mount
  useEffect(() => {
    if (startTimer) startTimer(startCountdown);

    //  Don't do anything if expiresAt is null
    if (!expiresAt) {
      return;
    }
    const expiryTime = new Date(expiresAt).getTime();
    const isExpired = new Date(expiresAt).getTime() <= Date.now();

    const now = Date.now();

    console.log("🕒 expiresAt:", expiresAt);
    console.log("🕓 Now:", now);
    console.log("🕓 isExpired:", isExpired);

    const remaining = Math.floor((expiryTime - now) / 1000);

    // console.log("🕒 Expiry Time:", expiryTime);
    // console.log("⏳ Remaining Seconds:", remaining);

    const isOtpStillValid = now < expiryTime;

    if (remaining > 0 && isOtpStillValid) {
      startCountdown(remaining);
    } else {
      setTimer(0);
      console.log("⛔ OTP expired or invalid.");
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // ✅ Only rerun if expiresAt or startTimer function changes
  }, [expiresAt, startTimer, timer]); // ❌ removed 'timer' from dependency

  const handleChange = (index: number, value: string) => {
    const char = value.toUpperCase();
    if (!/^[A-Z0-9]?$/.test(char)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = char;
    setOtp(updatedOtp);
    if (char && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[index] === "") {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-[90vw] max-w-[650px] flex items-center justify-center">
        <div className="w-full max-w-[90%] text-center sm:px-6 sm:py-10 md:px-10 md:py-12">
          <img src="/logo.svg" alt="StoreMins" className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Enter OTP</h2>
          <p className="text-sm text-gray-600 mb-6">
            We have sent an OTP to your mobile number.
          </p>

          <div className="flex justify-center gap-3 items-center mb-4">
            {otp.map((val, i) => (
              <React.Fragment key={i}>
                <input
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleBackspace(i, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                {i < otp.length - 1 && (
                  <span className="text-gray-400 font-semibold text-xl">-</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {timer > 0 && (
            <div className="text-sm text-gray-500 mb-4">
              OTP Expires in: {timer}s
            </div>
          )}

          <button
            onClick={onSubmit}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-md mb-4 text-lg"
          >
            Verify OTP
          </button>

          <p className="text-sm text-gray-600">
            Didn’t receive the code?{" "}
            {timer > 0 ? (
              <span className="text-gray-400">Resend OTP</span>
            ) : (
              <button
                onClick={onResend}
                className="text-[#7C3AED] font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}
          </p>

          <p className="text-sm text-green-600 mt-2">
            For Testing Purpose Use Code - AAAA
          </p>
          <p className="text-sm text-green-600 mt-2">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyForm;
