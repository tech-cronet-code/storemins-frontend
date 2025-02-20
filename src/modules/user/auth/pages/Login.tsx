// src/modules/auth/pages/Login.tsx
import LoginContainer from "../components/containers/LoginContainer";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginContainer />
      </div>
    </div>
  );
};

export default Login;
