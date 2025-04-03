import AppStoreBtn from "../../../../components/ui/buttons/AppStoreBtn";
import PlayStoreBtn from "../../../../components/ui/buttons/PlayStoreBtn";

// src/modules/auth/pages/Register.tsx
const Register = () => {
  return (
    <div className="h-screen w-screen">
      <div className="">
        <div className="hidden xl:block">wasd</div>
        <div className="">
          <PlayStoreBtn />
          <br />
          <AppStoreBtn />
        </div>
      </div>
      <div className=""></div>
    </div>
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    //   <div className="bg-white p-8 rounded shadow-md w-96">
    //     <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
    //     {/* Add registration form here */}
    //   </div>
    // </div>
  );
};

export default Register;
