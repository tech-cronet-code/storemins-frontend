import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../../common/utils/hashPassword";
import { LoginFormData } from "../components/LoginForm";
import SellerUnlockStoreForm from "../components/SellerUnlockStoreForm";
import { useAuth } from "../contexts/AuthContext";

const SellerUnlockStoreContainer = () => {
  const { login, logout } = useAuth();
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
    <>
      <SellerUnlockStoreForm onSubmit={handleLogin} logout={logout} />
      {/* 
      {loading && <p className="text-gray-500 text-sm mt-2">Logging in...</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>} 
      */}
    </>
  );
};

export default SellerUnlockStoreContainer;
