// src/modules/user/auth/hooks/useRegister.ts
import { useDispatch } from "react-redux";
import { RegisterPayload, useRegisterMutation } from "../../../../common/services/apiClient";
import { loginFailure, loginStart, registerSuccess } from "../../../../common/state/slices/authSlice";
import { AppDispatch } from "../../../../common/state/store";

export const useRegister = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [registerApi, { isLoading }] = useRegisterMutation();

    const register = async (payload: RegisterPayload): Promise<void> => {
        dispatch(loginStart()); // reuse loginStart for loading state

        try {
            const response = await registerApi(payload).unwrap();

            if (response.quickRegisterInfo) {
                dispatch(
                    registerSuccess({
                        user: {
                            id: response.quickRegisterInfo.id,
                            mobile: response.quickRegisterInfo.mobile,
                            role: payload.role,
                            name: payload.name,
                            pwd_hash: payload.pass_hash
                        },
                        token: undefined,
                        needsOtp: response.needs_confirm_otp_code,
                    })
                );
            }

            // You may handle redirection to OTP verify page here
        } catch (error) {
            let errorMessage = "Registration failed";
            if (typeof error === "object" && error !== null && "data" in error) {
                errorMessage = (error as { data: { message: string } }).data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            dispatch(loginFailure(errorMessage));
        }
    };

    return {
        register,
        loading: isLoading,
    };
};
