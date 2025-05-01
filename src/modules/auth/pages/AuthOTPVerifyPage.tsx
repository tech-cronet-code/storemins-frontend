import OTPVerifyContainer from "../containers/OTPVerifyContainer";
import AdForm from "../components/AdForm";

const AuthOTPVerifyPage = () => {
  console.log("OTPVerifyContainer loaded");

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* Left section */}
      <AdForm />

      {/* Right section */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 py-10 bg-white">
        <div className="w-full max-w-sm">
          <OTPVerifyContainer />
        </div>
      </div>
    </div>
  );
};

export default AuthOTPVerifyPage;
