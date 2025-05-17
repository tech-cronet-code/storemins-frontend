import { Dispatch, SetStateAction } from "react";
// import RegisterPage from "../../../modules/auth/pages/RegisterPage";
// import LoginPage from "../../../modules/auth/pages/LoginPage";

interface RegisterLoginToggleBtnProps {
  isRegister: boolean;
  setIsRegister: Dispatch<SetStateAction<boolean>>;
}
const RegisterLoginToggleBtn = ({
  isRegister,
  setIsRegister,
}: RegisterLoginToggleBtnProps) => {
  return (
    <>
      <div className="reg-log-btn-change w-2/3 bg-[#F6F6F6] rounded-full flex items-center justify-center gap-1 px-3">
        <button
          onClick={() => setIsRegister(true)}
          type="button"
          className={`p-3 w-1/2 rounded-full text-lg ${
            isRegister ? "bg-[#000842] text-white" : "bg-transparent text-black"
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setIsRegister(false)}
          type="button"
          className={`p-3 w-1/2 rounded-full text-lg ${
            !isRegister
              ? "bg-[#000842] text-white"
              : "bg-transparent text-black"
          }`}
        >
          Login
        </button>
      </div>
      {/* Conditionally render the RegisterPage or LoginPage here */}
      {/* {isRegister ? <RegisterPage /> : <LoginPage />} */}
    </>
  );
};

export default RegisterLoginToggleBtn;
