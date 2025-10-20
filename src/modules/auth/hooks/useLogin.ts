import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../common/state/store";
import { castToUserRoles } from "../../../common/utils/common";
import { showToast } from "../../../common/utils/showToast";
import { UserRoleName } from "../constants/userRoles";
import { loginFailure, loginStart, loginSuccess } from "../slices/authSlice";
import { LoginResponse, useLoginMutation } from "../services/sellerApi";

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginApi, { isLoading }] = useLoginMutation();

  const login = async (
    mobile: string,
    password: string
  ): Promise<{ needsOtp: boolean; role: UserRoleName[] | UserRoleName }> => {
    dispatch(loginStart());

    try {
      const apiResponse: LoginResponse = await loginApi({
        mobile,
        password,
      }).unwrap();

      const info = apiResponse?.data?.quickLoginInfo;

      console.log(info, "infoinfoinfoinfo");
      console.log(apiResponse?.data?.otpExpiresAt, "otpExpiresAt");
      console.log(
        {
          user: {
            id: info.id,
            name: info.name || "",
            mobile: info.mobile,
            role: castToUserRoles(info.role),
            permissions: info.permissions || [],
            tenantId: info.tenentId,
            mobile_confirmed: info.mobile_confirmed,
            otpExpiresAt: apiResponse.data.otpExpiresAt,
          },
          token: info.access_token, // ✅ Confirm this is not undefined
          refreshToken: "", // ❌ This is now in cookie, but you still pass it
        },
        "full"
      );

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
            mobile_confirmed: info.mobile_confirmed,
            otpExpiresAt: apiResponse.data.otpExpiresAt,
          },
          token: info.access_token, // ✅ Confirm this is not undefined
          refreshToken: "", // ❌ This is now in cookie, but you still pass it
        })
      );

      // setTimeout(() => {
      //   console.log("Redux state token:", store.getState().auth.token);
      // }, 500);

      // showToast({ message: "Login successful", type: "success" });
      const needsOtp = apiResponse?.data?.needs_confirm_otp_code ?? false;
      const role =
        castToUserRoles(apiResponse?.data?.quickLoginInfo.role) ??
        UserRoleName.GUEST;

      if (needsOtp) {
        showToast({
          message: "OTP verification required. Please check your phone.",
          type: "info",
        });
      }
      return { needsOtp, role }; // ✅ Return value here
    } catch (error) {
      let errorMessage = "Login failed";

      if (typeof error === "object" && error !== null && "data" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorMessage = (error as any).data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch(loginFailure(errorMessage));
      showToast({ message: errorMessage, type: "error" });

      // ❌ Still need to return in case of error to satisfy function type
      return { needsOtp: false, role: UserRoleName.GUEST };
    }
  };

  return {
    login,
    loading: isLoading,
  };
};
