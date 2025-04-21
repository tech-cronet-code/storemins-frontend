import LoginContainer from "../components/containers/LoginContainer";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0B132A]">
          Welcome Back 👋
        </h1>
        <LoginContainer />
      </div>
    </div>
  );
};

export default LoginPage;
