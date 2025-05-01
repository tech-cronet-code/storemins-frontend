import AdFormContainer from "../containers/AdFormContainer";
import OTPVerifyContainer from "../containers/OTPVerifyContainer";

const AuthOTPVerifyPage = () => {
  console.log("OTPVerifyContainer loaded");

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* LEFT SIDE */}
      {/* Start LEFT SIDE Add Form*/}
      <AdFormContainer />
      {/* END LEFT SIDE Add Form*/}

      {/* Start RIGHT SIDE */}
      <div className="lg:w-full md:w-3xl flex items-center justify-center bg-[#FFF] lg:px-10 md:mx-auto overflow-hidden">
        {/* <div className="flex"> */}
          <OTPVerifyContainer />
        </div>
      </div>
    // </div>
  );
};

export default AuthOTPVerifyPage;
