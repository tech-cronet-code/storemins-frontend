import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF, FaXTwitter, FaApple } from "react-icons/fa6";

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="form-input-style" />
        <input type="text" placeholder="Mobile number" className="form-input-style" />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="form-input-style pr-10"
          />
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
          </button>
        </div>
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" className="mt-1" />
          <span>
            I agree with <a href="#" className="text-blue-600 underline">Terms</a> and <a href="#" className="text-blue-600 underline">Privacy policy</a>.
          </span>
        </label>
        <button type="submit" className="btn-primary w-full">Register</button>
      </form>

      <div className="flex items-center justify-center mt-6">
        <hr className="border-t border-gray-200 w-full" />
        <span className="px-3 text-sm text-gray-500">Or register with</span>
        <hr className="border-t border-gray-200 w-full" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaGoogle className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition text-blue-600">
          <FaFacebookF className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaXTwitter className="text-lg" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <FaApple className="text-lg" />
        </button>
      </div>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#7F56D9] underline">
          Login
        </button>
      </p>
    </>
  );
};

export default RegisterForm;
