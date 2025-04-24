// AuthForm.jsx
import { useState } from "react";
import AdFormPage from "./AdForm";
import LoginForm from "./Login";
import RegisterPage from "./Register";
const AuthFormPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* LEFT SIDE */}
      {/* Start LEFT SIDE Add Form*/}
      <AdFormPage/>
        {/* END LEFT SIDE Add Form*/}

      {/* Start RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0B132A] mb-3">
              StoreMins
            </h1>
            <div className="flex justify-center gap-4 mb-4">
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
            <RegisterPage onSwitch={() => setIsRegister(false)} />
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
       {/* END RIGHT SIDE */}
    </div>
  );
};

export default AuthFormPage;
