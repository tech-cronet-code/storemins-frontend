// AuthForm.jsx
import { useState } from "react";
import AdFormContainer from "../containers/AdFormContainer";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
const AuthFormPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* LEFT SIDE */}
      {/* Start LEFT SIDE Add Form*/}
      <AdFormContainer />
      {/* END LEFT SIDE Add Form*/}

      {/* Start RIGHT SIDE */}
      <div className="lg:w-full md:w-3xl flex items-center justify-center bg-[#FFF] lg:px-10 md:mx-auto overflow-hidden">
        <div className="flex flex-col gap-4 mx-auto sm:mx-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0B132A] mb-8">StoreMin</h1>
            <div className="flex justify-center gap-4 mb-3">
              <button
                onClick={() => setIsRegister(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  !isRegister
                    ? "bg-[#0B132A] text-white"
                    : "bg-[#f4f4f4] text-gray-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  isRegister
                    ? "bg-[#0B132A] text-white"
                    : "bg-[#f4f4f4] text-gray-600"
                }`}
              >
                Register
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {isRegister
                ? "Enter your details to register"
                : "Login with mobile number"}
            </p>
          </div>
          {isRegister ? (
            <RegisterPage
            // onSwitch={() => setIsRegister(false)}
            />
          ) : (
            <LoginPage />
          )}
        </div>
      </div>
      {/* END RIGHT SIDE */}
    </div>
  );
};

export default AuthFormPage;
