import AdFormContainer from "../containers/AdFormContainer";
import OTPVerifyContainer from "../containers/OTPVerifyContainer";

const AuthOTPVerifyPage = () => {
  console.log("OTPVerifyContainer loaded");

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
  {/* LEFT SIDE - 50% width */}
  <div className="w-full lg:w-1/2">
    <AdFormContainer />
  </div>

  {/* RIGHT SIDE - 50% width */}
  <div className="w-full lg:w-1/2 lg:mb-50 mt-5 flex items-center justify-center">
    <OTPVerifyContainer />
  </div>
</div>
    // </div>
  );
};

export default AuthOTPVerifyPage;
