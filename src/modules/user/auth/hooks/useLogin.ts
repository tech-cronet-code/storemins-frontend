import { useDispatch } from "react-redux";
import { LoginResponse, useLoginMutation } from "../../../../common/services/apiClient";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../../common/state/slices/authSlice";
import { AppDispatch } from "../../../../common/state/store";
import { castToUserRoles } from "../../../../common/utils/common";
import { showToast } from "../../../../common/utils/showToast";

export const useLogin = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [loginApi, { isLoading }] = useLoginMutation();

  const login = async (mobile: string, password: string): Promise<{ needsOtp: boolean }> => {
    dispatch(loginStart());

    try {
      const apiResponse: LoginResponse = await loginApi({ mobile, password }).unwrap();

      const info = apiResponse?.data?.quickLoginInfo;

      console.log(info, "infoinfoinfoinfo");


      if (!info) {
        throw new Error("Login response missing user info");
      }
      console.log(" access_token from login:", info.access_token);

      dispatch(
        loginSuccess({
          user: {
            id: info.id,
            name: info.name || "",
            mobile: info.mobile,
            role: castToUserRoles(info.role),
            permissions: info.permissions || [],
            tenantId: info.tenentId,
          },
          token: info.access_token, // ✅ Confirm this is not undefined
          refreshToken: "",         // ❌ This is now in cookie, but you still pass it
        })
      );

      // setTimeout(() => {
      //   console.log("Redux state token:", store.getState().auth.token);
      // }, 500);

      // showToast({ message: "Login successful", type: "success" });
      const needsOtp = apiResponse?.data?.needs_confirm_otp_code ?? false;
      if (needsOtp) {
        showToast({
          message: "OTP verification required. Please check your phone.",
          type: "info",
        });
      }
      return { needsOtp }; // ✅ Return value here

    } catch (error) {
      let errorMessage = "Login failed";

      if (typeof error === "object" && error !== null && "data" in error) {
        errorMessage = (error as any).data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch(loginFailure(errorMessage));
      showToast({ message: errorMessage, type: "error" });


        // ❌ Still need to return in case of error to satisfy function type
        return { needsOtp: false };
    }
  };

  return {
    login,
    loading: isLoading,
  };
};
