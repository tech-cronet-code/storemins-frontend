import React, { useState, useEffect, useRef } from "react";

const OTPVerifyPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isResendClickedRef = useRef(false); // ✅ To control first-time load

  useEffect(() => {
    // Start countdown only if triggered via "Resend OTP"
    if (timer > 0 && isResendClickedRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length === otp.length) {
      alert(`OTP Entered: ${code}`);
    } else {
      alert("Please enter full OTP.");
    }
  };

  const handleResend = () => {
    console.log("Resend OTP clicked");
    setOtp(["", "", "", ""]);
    setTimer(30);
    isResendClickedRef.current = true; // ✅ allow timer to run
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md text-center px-10 py-12 border rounded-lg shadow-sm">
        <img src="/logo.svg" alt="StoreMins" className="mx-auto mb-4 h-10" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-8">
          We have sent an OTP to your mobile number.
        </p>

        {/* OTP Boxes with Dashes */}
        <div className="flex justify-center gap-3 items-center mb-2">
          {otp.map((val, i) => (
            <React.Fragment key={i}>
              <input
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleBackspace(i, e)}
                className="w-14 h-14 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {i < otp.length - 1 && (
                <span className="text-gray-400 font-semibold text-xl">-</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <div className="text-sm text-gray-500 mb-4">
            OTP Expires in: {timer}s
          </div>
        )}

        <button
          onClick={handleSubmit}
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
              onClick={handleResend}
              className="text-[#7C3AED] font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </p>
        <p className="text-sm text-green-600 mt-2">
          For Testing Purpose Use Code - AAAA
        </p>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
