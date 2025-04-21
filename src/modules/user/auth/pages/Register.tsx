// src/modules/user/auth/pages/Register.tsx

import RegisterContainer from "../components/containers/RegisterContainer";

interface RegisterPageProps {
  onSwitch: () => void;
}

const RegisterPage = ({ onSwitch }: RegisterPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#0B132A]">
          Create your account
        </h1>
        <RegisterContainer onSwitch={onSwitch} />
      </div>
    </div>
  );
};

export default RegisterPage;
