// AuthForm.jsx
import { useState } from "react";
import img1 from "../../../../assets/icons/App Logo Inspiraton 106.png";
import img2 from "../../../../assets/icons/App Logo Inspiraton 137.png";
import img3 from "../../../../assets/icons/App Logo Inspiraton 164.png";
import img4 from "../../../../assets/icons/App Logo Inspiraton 21.png";
import img7 from "../../../../assets/icons/App Logo Inspiraton 42.png";
import img5 from "../../../../assets/icons/App Logo Inspiraton 92.png";
import img6 from "../../../../assets/icons/Logo Shapes 21.png";
import adImg from "../../../../assets/images/adImg.png";
import AppStoreBtn from "../../../../components/ui/buttons/AppStoreBtn";
import PlayStoreBtn from "../../../../components/ui/buttons/PlayStoreBtn";
import LoginForm from "./Login";
import RegisterPage from "./Register";
const logos = [img4, img7, img5, img1, img2, img3, img6];

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB]">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-4xl space-y-10">
          <div className="bg-[#e4e4e5] rounded-lg p-6 lg:p-10 space-y-6">
            <h2 className="text-3xl font-semibold text-center">Show the best of your business</h2>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#0B132A] leading-tight">
                  We Provide Many <br /> Features You Can Use
                </h3>
                <p className="text-[#4F5665] leading-relaxed">
                  You can explore the features that we provide with fun and have their own functions each feature.
                </p>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#4F5665]">
                    <span>✅</span>
                    <span>Powerful online protection.</span>
                  </div>
                ))}
              </div>
              <img src={adImg} alt="Ad" className="w-full max-w-xs lg:max-w-[60%]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 mb-3">Trusted by more than 100+ businesses</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {logos.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`logo-${i}`}
                  className="w-14 h-14 object-contain"
                />
              ))}
            </div>;
          </div>
          <div className="bg-[#000052] text-white p-6 rounded-lg">
            <p className="mb-2 text-sm lg:text-base">
              Create a free account and get full access to all features for 30 days. No credit card needed.
              Trusted by over 4,000 professionals.
            </p>
            <div className="flex items-center gap-2 text-yellow-300">
              ⭐⭐⭐⭐☆ <span className="text-white text-sm">4.0 from 200+ reviews</span>
            </div>
            <div className="flex gap-4 mt-4">
              <PlayStoreBtn />
              <AppStoreBtn />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#0B132A] mb-3">StoreMins</h1>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setIsRegister(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${!isRegister ? "bg-[#0B132A] text-white" : "bg-[#f4f4f4] text-gray-600"}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium ${isRegister ? "bg-[#0B132A] text-white" : "bg-[#f4f4f4] text-gray-600"}`}
              >
                Register
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {isRegister ? "Enter your details to register" : "Login with mobile number"}
            </p>
          </div>
          {isRegister ? <RegisterPage onSwitch={() => setIsRegister(false)} /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
