import { useEffect, useState } from "react";

const OTPVerifyForm = ({ onSubmit }: { onSubmit: (otp: string) => void }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleSubmit = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
      onSubmit(fullOtp);
    } else {
      alert("Please enter full 4-digit OTP");
    }
  };

  return (
    <div className="text-center">
      <img src="/logo-icon.svg" alt="StoreMins Logo" className="mx-auto mb-5 h-10" />

      <h2 className="text-2xl font-semibold text-[#0B132A] mb-1">Enter OTP</h2>
      <p className="text-sm text-gray-500 mb-6">We have sent a OTP to your mobile number</p>

      <div className="flex justify-center gap-4 mb-6">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(idx, e.target.value)}
            className="w-12 h-12 rounded-md text-center text-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#7C3AED] text-white font-semibold py-2 rounded-md hover:bg-[#6D28D9] transition"
      >
        Verify
      </button>

      <div className="mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>
            Resend OTP in <span className="font-medium">{timer}s</span>
          </p>
        ) : (
          <p>
            Didn’t receive code?{" "}
            <button
              onClick={() => setTimer(30)}
              className="text-[#7C3AED] font-medium hover:underline"
            >
              Resend OTP
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default OTPVerifyForm;
