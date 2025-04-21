import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../../../common/services/apiClient";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../../common/state/slices/authSlice";
import { AppDispatch } from "../../../../common/state/store";
import { showToast } from "../../../../common/utils/showToast";
import { UserRoleName } from "../constants/userRoles";
import { LoginResponse } from "../../../../common/services/apiClient";

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginApi, { isLoading }] = useLoginMutation();

  const login = async (mobile: string, password: string): Promise<void> => {
    dispatch(loginStart());

    try {
      const apiResponse: LoginResponse = await loginApi({ mobile, password }).unwrap();

      const info = apiResponse?.quickLoginInfo;

      console.log(info, "infoinfoinfoinfo");
      

      if (!info) {
        throw new Error("Login response missing user info");
      }

      dispatch(
        loginSuccess({
          user: {
            id: info.id,
            name: info.name || "",
            mobile: info.mobile,
            role: info.role || UserRoleName.GUEST,
            permissions: info.permissions || [],
            tenantId: info.tenentId,
          },
          token: info.access_token,
        })
      );

      // showToast({ message: "Login successful", type: "success" });

      if (apiResponse.needs_confirm_otp_code) {
        showToast({
          message: "OTP verification required. Please check your phone.",
          type: "info",
        });
      }
    } catch (error) {
      let errorMessage = "Login failed";

      if (typeof error === "object" && error !== null && "data" in error) {
        errorMessage = (error as any).data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch(loginFailure(errorMessage));
      showToast({ message: errorMessage, type: "error" });
    }
  };

  return {
    login,
    loading: isLoading,
  };
};
