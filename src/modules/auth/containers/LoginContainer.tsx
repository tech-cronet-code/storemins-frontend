import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../../common/utils/hashPassword";
import { useAuth } from "../contexts/AuthContext";
import LoginForm, { LoginFormData } from "../components/LoginForm";

const LoginContainer = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate(); // ✅ Safe now

  const handleLogin = async (data: LoginFormData) => {
    const hashedPassword = await hashPassword(data.password); // 👈 hash it
    const { needsOtp, role } = await login(data.mobile, hashedPassword);
    console.log(needsOtp, "LoginContainer - needsOtp");
    console.log(role, "LoginContainer - role");

    if (needsOtp) {
      navigate("/otp-verify");
    } else {
      // 👇 Route based on role
      const firstRole = role?.[0];
      switch (firstRole) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "SELLER":
          navigate("/seller");
          break;
        default:
          navigate("/home");
      }
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {loading && <p className="text-gray-500 text-sm mt-2">Logging in...</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default LoginContainer;
