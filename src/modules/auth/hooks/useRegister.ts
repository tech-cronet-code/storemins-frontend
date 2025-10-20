// src/modules/user/auth/hooks/useRegister.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/state/store";
import { showToast } from "../../../common/utils/showToast";
import { RegisterPayload, useRegisterMutation } from "../services/sellerApi";
import { loginFailure, loginStart, registerSuccess } from "../slices/authSlice";
import { UserRoleName } from "../constants/userRoles";

export const useRegister = (
  onQuickLoginEnable?: (enabled: boolean) => void
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [registerApi, { isLoading }] = useRegisterMutation();

  const register = async (
    payload: RegisterPayload
  ): Promise<{ needsOtp: boolean; quickLoginEnable: boolean }> => {
    dispatch(loginStart());

    let quickLoginEnable = false;
    let needsOtp = false;

    try {
      const response = await registerApi(payload).unwrap();
      console.log(response, "response ???");

      if (response && response.quickRegisterInfo) {
        quickLoginEnable = response.quickLoginEnable ?? false;
        needsOtp = response.needs_confirm_otp_code ?? false;

        onQuickLoginEnable?.(quickLoginEnable);

        const {
          id,
          mobile,
          role,
          permissions,
          access_token,
          refresh_token,
          mobile_confirmed,
        } = response.quickRegisterInfo;

        // 👇 cast `role` properly
        const castedRoles = role as UserRoleName[];

        dispatch(
          registerSuccess({
            user: {
              id,
              mobile,
              role: castedRoles || [],
              permissions: permissions || [],
              name: payload.name, // Name comes from input
              mobile_confirmed: mobile_confirmed ?? false,
            },
            token: access_token,
            refreshToken: refresh_token,
            needsOtp,
          })
        );

        showToast({
          type: "success",
          message:
            response.message ||
            "We have sent a new OTP to your mobile number. Please verify the OTP to complete your registration.",
          showClose: true,
        });

        return { needsOtp, quickLoginEnable };
      }

      quickLoginEnable = response.quickLoginEnable;
      onQuickLoginEnable?.(quickLoginEnable);

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

    return { needsOtp, quickLoginEnable };
  };

  return {
    register,
    loading: isLoading,
  };
};
