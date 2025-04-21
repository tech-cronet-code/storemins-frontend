// src/modules/user/auth/components/containers/RegisterContainer.tsx

import { useAuth } from "../../context/AuthContext";
import RegisterForm, { RegisterFormData } from "../ui/RegisterForm";

const RegisterContainer = ({ onSwitch }: { onSwitch: () => void }) => {
    const { register, loading, error } = useAuth();

    const handleSubmit = async (data: RegisterFormData) => {
        await register({
            name: data.name,
            mobile: data.mobile,
            pass_hash: data.pass_hash,
            role: data.role, // Adjust as needed
            isTermAndPrivarcyEnable: data.isTermAndPrivarcyEnable,
        });
    };

    return (
        <div>
            <RegisterForm onSwitch={onSwitch} onSubmit={handleSubmit} />
            {loading && <p className="text-gray-500 text-sm mt-2">Registering...</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default RegisterContainer;
