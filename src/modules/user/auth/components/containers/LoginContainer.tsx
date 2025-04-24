import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../../../../common/utils/hashPassword";
import { useAuth } from "../../context/AuthContext";
import LoginForm, { LoginFormData } from "../ui/LoginForm";

const LoginContainer = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate(); // ✅ Safe now

  const handleLogin = async (data: LoginFormData) => {
    const hashedPassword = await hashPassword(data.password); // 👈 hash it
    const { needsOtp } = await login(data.mobile, hashedPassword);
    if (needsOtp) {
      navigate("/otp-verify");
    } else {
      navigate("/seller"); // or wherever needed
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {loading && <p className="text-gray-500 text-sm mt-2">Logging in...</p>}
      {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>} */}
    </div>
  );
};

export default LoginContainer;
