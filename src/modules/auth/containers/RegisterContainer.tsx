// src/modules/user/auth/components/containers/RegisterContainer.tsx

import { hashPassword } from "../../../common/utils/hashPassword";
import { showToast } from "../../../common/utils/showToast";
import { useAuth } from "../contexts/AuthContext";
import RegisterForm, { RegisterFormData } from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

const RegisterContainer = () =>
  // { onSwitch }: { onSwitch: () => void }
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
        } else {
          navigate("/homes");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div>
        <RegisterForm
          // onSwitch={onSwitch}
          onSubmit={handleSubmit}
        />
        {loading && (
          <p className="text-gray-500 text-sm mt-2">Registering...</p>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  };

export default RegisterContainer;
