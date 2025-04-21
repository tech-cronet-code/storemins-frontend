// src/modules/user/auth/hooks/useRegister.ts
import { useDispatch } from "react-redux";
import { RegisterPayload, useRegisterMutation } from "../../../../common/services/apiClient";
import { loginFailure, loginStart, registerSuccess } from "../../../../common/state/slices/authSlice";
import { AppDispatch } from "../../../../common/state/store";
import { showToast } from "../../../../common/utils/showToast";

export const useRegister = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [registerApi, { isLoading }] = useRegisterMutation();

    const register = async (payload: RegisterPayload): Promise<void> => {
        dispatch(loginStart());

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
                            pwd_hash: payload.pass_hash,
                        },
                        token: undefined,
                        needsOtp: response.needs_confirm_otp_code,
                    })
                );

                showToast({
                    type: "success",
                    message: response.message || "We have sent a new OTP to your mobile number. Please verify the OTP to complete your registration."
                    ,
                    showClose: true,
                });

                // You can redirect to OTP verification page here if needed
                return;
            }

            showToast({
                type: "info",
                message: response.message || "Check your phone for OTP confirmation.",
                showClose: true,
            });

        } catch (error) {
            let errorMessage = "Registration failed";
            if (typeof error === "object" && error !== null && "data" in error) {
                errorMessage = (error as { data: { message: string } }).data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            dispatch(loginFailure(errorMessage));

            showToast({
                type: "error",
                message: errorMessage,
                showClose: true,
            });
        }
    };

    return {
        register,
        loading: isLoading,
    };
};
