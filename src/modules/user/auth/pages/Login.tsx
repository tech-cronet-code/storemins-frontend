import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF } from "react-icons/fa6";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <form className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative w-[100px]">
            <select
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              defaultValue="+91"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
              ▾
            </div>
          </div>

          <input
            type="text"
            placeholder="enter your mobile number"
            className="form-input-style w-full"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="enter your password"
            className="form-input-style pr-10"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
          </button>
        </div>

        <button type="submit" className="btn-primary w-full">
          Send OTP
        </button>
        <p className="text-center text-sm text-[#7F56D9] font-medium cursor-pointer">
          Try another way
        </p>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">Don’t have an account yet?</p>
      <div className="flex items-center justify-center mt-2">
        <hr className="border-t border-gray-200 w-full" />
        <span className="px-3 text-sm text-gray-500">Or continue with</span>
        <hr className="border-t border-gray-200 w-full" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 transition">
          <FaGoogle className="text-[#EA4335] text-base" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 transition">
          <FaFacebookF className="text-[#1877F2] text-base" />
          <span className="text-gray-700 font-medium">Sign in with Facebook</span>
        </button>
      </div>
    </>
  );
};

export default LoginForm;