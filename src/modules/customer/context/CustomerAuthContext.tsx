import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../common/state/store";

// slice actions (customer)
import {
  loginSuccess as customerLoginSuccess,
  logout as customerLogoutAction,
} from "../../auth/slices/customerAuthSlice";

// customer API hooks (from customerApi you split earlier)
import {
  useCustomerConfirmOtpMutation,
  useCustomerLoginInitMutation,
  useCustomerLogoutMutation,
  useCustomerRegisterMutation,
  useCustomerResendOtpMutation,
} from "../services/customerApi";

/* ---------- Types ---------- */
export type CustomerRole = string; // keep loose to match BE
export interface CustomerUser {
  id: string;
  name?: string;
  mobile: string;
  role?: CustomerRole[]; // or single role depending on BE
  permissions?: string[];
  mobile_confirmed?: boolean;
  otpExpiresAt?: string | null;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  /** Step 1: login init by mobile (OTP flow starter) */
  loginInit: (mobile: string) => Promise<{
    id: string;
    needs_confirm_otp_code: boolean;
    otpExpiresAt: string | null;
    message?: string;
  }>;

  /** Alternative Step 1: register (also sends OTP) */
  register: (payload: {
    name: string;
    mobile: string;
    isTermAndPrivarcyEnable: boolean;
    email?: string;
  }) => Promise<{
    id: string;
    needs_confirm_otp_code: boolean;
    otpExpiresAt: string | null;
    message?: string;
  }>;

  /** Step 2: confirm OTP → issues tokens & logs in customer */
  confirmOtp: (params: {
    mobile: string;
    code: string; // confirm_mobile_otp_code
  }) => Promise<void>;

  /** Optional: resend OTP */
  resendOtp: (params: { mobile: string; userId?: string }) => Promise<{
    message: string;
    expiresAt: string;
  }>;

  /** Logout (clears local state, also hits BE best-effort) */
  logout: () => Promise<void>;
}

/* ---------- Context ---------- */
const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

/* ---------- Provider ---------- */
export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  // read from dedicated customer slice
  const { user, token, loading, error } = useSelector(
    (s: RootState) => s.customerAuth
  );

  // rtk query hooks
  const [loginInitApi] = useCustomerLoginInitMutation();
  const [registerApi] = useCustomerRegisterMutation();
  const [confirmOtpApi] = useCustomerConfirmOtpMutation();
  const [resendOtpApi] = useCustomerResendOtpMutation();
  const [logoutApi] = useCustomerLogoutMutation();

  /* ---------- token expiry watchdog ---------- */
  useEffect(() => {
    if (!token) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        // customer token expired → local logout only (refresh handled by baseQuery)
        dispatch(customerLogoutAction());
      }
    } catch {
      dispatch(customerLogoutAction());
    }
  }, [token, dispatch]);

  /* ---------- (optional) keep slice.user in sync if you ever fetch a profile ----------
     You currently don't have a "get my customer profile" endpoint.
     When you add one, mirror SellerAuthContext's refetch + setUser mapping here.
  ------------------------------------------------------------------------------- */

  /* ---------- actions ---------- */

  const loginInit: CustomerAuthContextType["loginInit"] = async (mobile) => {
    const res = await loginInitApi({ mobile }).unwrap();
    return {
      id: res.id,
      needs_confirm_otp_code: res.needs_confirm_otp_code,
      otpExpiresAt: res.otpExpiresAt ?? null,
      message: res.message,
    };
  };

  const register: CustomerAuthContextType["register"] = async (payload) => {
    const res = await registerApi(payload).unwrap();
    return {
      id: res.id,
      needs_confirm_otp_code: res.needs_confirm_otp_code,
      otpExpiresAt: res.otpExpiresAt ?? null,
      message: res.message,
    };
  };

  const confirmOtp: CustomerAuthContextType["confirmOtp"] = async ({
    mobile,
    code,
  }) => {
    const data = await confirmOtpApi({
      mobile,
      confirm_mobile_otp_code: code,
    }).unwrap();

    // BE returns JwtResponseDto-like object
    const customerUser: CustomerUser = {
      id: data.id,
      name: data.name ?? "",
      mobile: data.mobile,
      role: (data.role ?? []) as CustomerRole[],
      permissions: data.permissions ?? [],
      mobile_confirmed: data.mobile_confirmed ?? true,
    };

    dispatch(
      customerLoginSuccess({
        user: customerUser,
        token: data.access_token,
        refreshToken: data.refresh_token ?? null,
      })
    );
  };

  const resendOtp: CustomerAuthContextType["resendOtp"] = async (params) => {
    const res = await resendOtpApi(params).unwrap();
    return res;
  };

  const logout: CustomerAuthContextType["logout"] = async () => {
    try {
      // Try to tell BE (its endpoint expects body { access_token })
      if (token) {
        await logoutApi({ access_token: token }).unwrap();
      }
    } catch {
      // ignore network/4xx on logout
    } finally {
      dispatch(customerLogoutAction());
      // optional UX redirect:
      // window.location.href = "/home";
    }
  };

  const value = useMemo<CustomerAuthContextType>(
    () => ({
      user,
      token,
      loading,
      error,
      loginInit,
      register,
      confirmOtp,
      resendOtp,
      logout,
    }),
    [
      user,
      token,
      loading,
      error,
      loginInit,
      register,
      confirmOtp,
      resendOtp,
      logout,
    ]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

/* ---------- hook ---------- */
export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    );
  }
  return ctx;
};
