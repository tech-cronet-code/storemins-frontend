import { hashPassword } from "../../../../../common/utils/hashPassword";
import { useAuth } from "../../context/AuthContext";
import LoginForm, { LoginFormData } from "../ui/LoginForm";

const LoginContainer = () => {
  const { login, loading } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    const hashedPassword = await hashPassword(data.password); // 👈 hash it
    await login(data.mobile, hashedPassword);
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
