// src/modules/auth/components/containers/LoginContainer.tsx
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../ui/LoginForm";

const LoginContainer = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login(email, password);
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LoginContainer;
