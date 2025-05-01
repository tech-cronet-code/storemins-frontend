import OTPVerifyForm from "../components/OTPVerifyForm";

const OTPVerifyContainer = () => {
  const handleVerify = (otp: string) => {
    console.log("Verify OTP:", otp);
    // 🔐 Call your verify OTP API here
  };

  return <OTPVerifyForm onSubmit={handleVerify} />;
};

export default OTPVerifyContainer;
