// src/modules/user/auth/pages/Register.tsx

// import RegisterContainer from "../components/containers/RegisterContainer";
import AdFormContainer from "../containers/AdFormContainer";
import RegisterContainer from "../containers/RegisterContainer";

// interface RegisterPageProps {
//   onSwitch: () => void;
// }

const RegisterPage = () =>
  // { onSwitch }: RegisterPageProps
  {
    // const { register, loading, error } = useAuth();
    // const navigate = useNavigate(); // ✅ Safe now
    // const handleSubmit = async (data: RegisterFormData) => {
    //   const hashedPassword = await hashPassword(data.pass_hash); // 👈 hash here
    //   try {
    //     const { needsOtp } = await register({
    //       name: data.name,
    //       mobile: data.mobile,
    //       pass_hash: hashedPassword,
    //       role: data.role, // Adjust as needed
    //       isTermAndPrivarcyEnable: data.isTermAndPrivarcyEnable,
    //     });
    //     // showToast({ message: 'Registration successful. Please verify OTP.', type: 'success' });

    //     console.log(needsOtp, "RegisterContainer - needsOtp");
    //     if (needsOtp) {
    //       navigate("/otp-verify");
    //     }
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   } catch (err) {
    //     showToast({
    //       message: "Registration failed. Please try again.",
    //       type: "error",
    //       showClose: true,
    //     });
    //     //   showToast({ message: 'Something went wrong', type: 'error', showClose: false });
    //   }
    // };
    // const [isRegister, setIsRegister] = useState(false);

    return (
      <div className="w-full h-full flex flex-col border-2 lg:flex-row lg:h-screen">
        {/* Right: Register Part */}
        {/* <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Left: Ad Part */}
        <div className="w-full h-full flex">
          <AdFormContainer />
        </div>
        <div className="w-full h-full border-2 flex justify-center items-center">
          <RegisterContainer />
        </div>
        {/* <LoginContainer /> */}
        {/* </div> */}
      </div>
    );
  };

export default RegisterPage;
