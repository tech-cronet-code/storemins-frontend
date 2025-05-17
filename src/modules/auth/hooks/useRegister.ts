// src/modules/user/auth/hooks/useRegister.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/state/store";
import { showToast } from "../../../common/utils/showToast";
import { RegisterPayload, useRegisterMutation } from "../services/authApi";
import { loginFailure, loginStart, registerSuccess } from "../slices/authSlice";

export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [registerApi, { isLoading }] = useRegisterMutation();

  const register = async (
    payload: RegisterPayload
  ): Promise<{ needsOtp: boolean }> => {
    dispatch(loginStart());

    try {
      const response = await registerApi(payload).unwrap();

      if (response.quickRegisterInfo) {
        console.log(response, "response");
        console.log(payload, "payload");

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

        const needsOtp = response.needs_confirm_otp_code ?? false;
        if (needsOtp) {
          showToast({
            type: "success",
            message:
              response.message ||
              "We have sent a new OTP to your mobile number. Please verify the OTP to complete your registration.",
            showClose: true,
          });
        }
        return { needsOtp }; // ✅ Return value here
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
    // ❌ Still need to return in case of error to satisfy function type
    return { needsOtp: false };
  };

  return {
    register,
    loading: isLoading,
  };
};
