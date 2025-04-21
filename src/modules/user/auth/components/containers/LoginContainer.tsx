import { useAuth } from "../../context/AuthContext";
import LoginForm from "../ui/LoginForm";

export const LoginContainer = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async (data: { mobile: string; password: string }) => {
    await login(data.mobile, data.password); // 🔄 call global login
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {loading && <p className="text-gray-500 text-sm">Logging in...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default LoginContainer;
