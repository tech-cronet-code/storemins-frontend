// src/modules/user/auth/pages/Register.tsx

import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../../../common/utils/hashPassword";
import RegisterContainer from "../components/containers/RegisterContainer";
import RegisterForm, { RegisterFormData } from "../components/ui/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../../../../common/utils/showToast";
import AdFormPage from "./AdForm";

interface RegisterPageProps {
  onSwitch: () => void;
}

const RegisterPage = () =>
  // { onSwitch }: RegisterPageProps
  {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate(); // ✅ Safe now
    const handleSubmit = async (data: RegisterFormData) => {
      const hashedPassword = await hashPassword(data.pass_hash); // 👈 hash here
      try {
        const { needsOtp } = await register({
          name: data.name,
          mobile: data.mobile,
          pass_hash: hashedPassword,
          role: data.role, // Adjust as needed
          isTermAndPrivarcyEnable: data.isTermAndPrivarcyEnable,
        });
        // showToast({ message: 'Registration successful. Please verify OTP.', type: 'success' });

        console.log(needsOtp, "RegisterContainer - needsOtp");
        if (needsOtp) {
          navigate("/otp-verify");
        }
      } catch (err) {
        showToast({
          message: "Registration failed. Please try again.",
          type: "error",
          showClose: true,
        });
        //   showToast({ message: 'Something went wrong', type: 'error', showClose: false });
      }
    };

    return (
      <div className="flex items-center justify-center">
        <AdFormPage />
        <div className="min-h-screen w-1/2 flex items-center justify-center bg-[#FFF] px-10 ">
          <div className="w-full flex flex-col justify-center gap-6">
            <div className="flex items-center justify-center">
              <div className="reg-log-btn-change w-2/3 bg-[#F6F6F6] rounded-full flex items-center justify-center gap-3 p-3">
                <button
                  type="button"
                  className="bg-[#000842] p-3 w-1/2 rounded-full text-white text-lg"
                >
                  Register
                </button>
                <button
                  type="button"
                  className="bg-none p-3 w-1/2 rounded-full text-lg"
                >
                  Login
                </button>
              </div>
            </div>
            <p className="text-lg text-center text-[#475467]">
              Enter your details to register
            </p>
            <RegisterForm onSubmit={handleSubmit} />
            {/* <RegisterContainer
          onSwitch={onSwitch}
          /> */}
          </div>
        </div>
        {loading && (
          <p className="text-gray-500 text-sm mt-2">Registering...</p>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  };

export default RegisterPage;
