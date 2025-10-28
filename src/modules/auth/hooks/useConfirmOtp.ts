import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/state/store";
import toast from "react-hot-toast";
import { useConfirmOtpMutation } from "../services/sellerApi";
import { useCallback } from "react";
import { confirmOtpSuccess } from "../slices/sellerAuthSlice";

export const useConfirmOtp = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.sellerAuth.user);
  const [confirmOtpApi] = useConfirmOtpMutation();

  const confirm = useCallback(
    async (code: string): Promise<void> => {
      // Fallback to localStorage if Redux not ready
      const user =
        reduxUser ??
        JSON.parse(localStorage.getItem("seller_auth_user") || "null");

      if (!user?.mobile) {
        toast.error("Mobile number is missing. Please login again.");
        return;
      }

      try {
        const response = await confirmOtpApi({
          mobile: user.mobile,
          confirm_mobile_otp_code: code,
        }).unwrap();

        dispatch(confirmOtpSuccess({ mobile_confirmed: true }));
        toast.success(
          response.mobile_confirmed ? "OTP verified successfully!" : "Failed!"
        );
        sessionStorage.removeItem("otpExpiresAt");
        //  Update localStorage
        const updatedUser = {
          ...user,
          mobile_confirmed: response.mobile_confirmed,
        };
        localStorage.setItem("seller_auth_user", JSON.stringify(updatedUser));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.data?.message || "OTP verification failed.");
      }
    },
    [confirmOtpApi, reduxUser, dispatch]
  );

  return { confirm };
};
