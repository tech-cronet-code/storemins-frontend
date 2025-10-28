// src/modules/customer/context/CustomerAuthContext.tsx
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
import {
  loginSuccess as customerLoginSuccess,
  logout as customerLogoutAction,
} from "../../auth/slices/customerAuthSlice";
import {
  useCustomerConfirmOtpMutation,
  useCustomerLoginInitMutation,
  useCustomerLogoutMutation,
  useCustomerRegisterMutation,
  useCustomerResendOtpMutation,
  useGetMyProfileQuery,
} from "../services/customerApi";
import { useGetStorefrontBootstrapQuery } from "../../auth/services/storefrontPublicApi";
import type { GetMyProfileDto } from "../services/customerApi";

/* ------------------------------- Types ---------------------------------- */

export type CustomerRole = string;

export interface CustomerUser {
  id: string;
  name?: string;
  mobile: string;
  role?: CustomerRole[];
  permissions?: string[];
  mobile_confirmed?: boolean;
  otpExpiresAt?: string | null;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  userDetails: GetMyProfileDto | null;
  /** Will be non-null only if bootstrap provided it */
  businessId: string;

  loginInit: (mobile: string) => Promise<{
    id: string;
    needs_confirm_otp_code: boolean;
    otpExpiresAt: string | null;
    message?: string;
  }>;

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

  confirmOtp: (params: { mobile: string; code: string }) => Promise<void>;
  resendOtp: (params: { mobile: string; userId?: string }) => Promise<{
    message: string;
    expiresAt: string;
  }>;
  logout: () => Promise<void>;
}

/* ------------------------------- Helpers -------------------------------- */

function resolveStoreSlug(): string | null {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="store-slug"]'
  );
  if (meta?.content?.trim()) return meta.content.trim();

  const ds =
    document.body?.getAttribute("data-store-slug") ||
    document.documentElement?.getAttribute("data-store-slug");
  if (ds && ds.trim()) return ds.trim();

  const storedKeys = [
    "storeSlug",
    "shopSlug",
    "store_slug",
    "shop_slug",
    "current_store_slug",
  ];
  for (const k of storedKeys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v && v.trim()) return v.trim();
  }

  const reserved = new Set([
    "home",
    "otp-verify",
    "customer",
    "seller",
    "admin",
    "api",
    "profile",
    "auth",
    "login",
    "signup",
    "dashboard",
  ]);
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  if (first && !reserved.has(first)) return first;
  return null;
}

const buildHomeUrl = () => {
  const slug = resolveStoreSlug();
  return slug ? `/${slug}` : "/";
};

/* ------------------------------- Context -------------------------------- */

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

/* ------------------------------- Provider ------------------------------- */

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (s: RootState) => s.customerAuth
  );

  // Bootstrap once and derive businessId ONLY from settings (handles misspelling too)
  const slug = resolveStoreSlug();
  const { data: bootstrap } = useGetStorefrontBootstrapQuery(
    { slug: slug ?? "" },
    { skip: !slug }
  );
  const businessId: string =
    (bootstrap?.settings as any)?.businessId ??
    (bootstrap?.settings as any)?.bussinessId ??
    null;

  const [loginInitApi] = useCustomerLoginInitMutation();
  const [registerApi] = useCustomerRegisterMutation();
  const [confirmOtpApi] = useCustomerConfirmOtpMutation();
  const [resendOtpApi] = useCustomerResendOtpMutation();
  const [logoutApi] = useCustomerLogoutMutation();

  const { data: myProfile } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });

  /* ----------------------- Token Expiry Auto Logout ---------------------- */
  useEffect(() => {
    if (!token) return;
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) dispatch(customerLogoutAction());
    } catch {
      dispatch(customerLogoutAction());
    }
  }, [token, dispatch]);

  /* ----------------------------- Actions -------------------------------- */

  const loginInit = async (mobile: string) => {
    const res = await loginInitApi({ mobile, businessId }).unwrap();
    return {
      id: res.id,
      needs_confirm_otp_code: res.needs_confirm_otp_code,
      otpExpiresAt: res.otpExpiresAt ?? null,
      message: res.message,
    };
    // businessId is needed for login-init
  };

  const register = async (payload: {
    name: string;
    mobile: string;
    isTermAndPrivarcyEnable: boolean;
    email?: string;
  }) => {
    if (!businessId)
      throw new Error("Business ID not available from bootstrap");
    const res = await registerApi({
      customerName: payload.name,
      mobile: payload.mobile,
      isTermAndPrivarcyEnable: payload.isTermAndPrivarcyEnable,
      email: payload.email,
      businessId, // ✅ always the value from bootstrap (businessId | bussinessId)
    }).unwrap();

    return {
      id: res.id,
      needs_confirm_otp_code: res.needs_confirm_otp_code,
      otpExpiresAt: res.otpExpiresAt ?? null,
      message: res.message,
    };
  };

  const confirmOtp = async ({
    mobile,
    code,
  }: {
    mobile: string;
    code: string;
  }) => {
    if (!businessId)
      throw new Error("Business ID not available from bootstrap");
    const res = await confirmOtpApi({
      mobile,
      confirm_mobile_otp_code: code,
      businessId, // ✅ from bootstrap only
    }).unwrap();

    const customerUser: CustomerUser = {
      id: res.id,
      name: res.name ?? "",
      mobile: res.mobile,
      role: (res.role ?? []) as string[],
      permissions: res.permissions ?? [],
      mobile_confirmed: res.mobile_confirmed ?? true,
    };

    dispatch(
      customerLoginSuccess({
        user: customerUser,
        token: res.access_token,
        refreshToken: res.refresh_token ?? null,
      })
    );
  };

  const resendOtp = async (params: { mobile: string; userId?: string }) => {
    return await resendOtpApi(params).unwrap();
  };

  const logout = async () => {
    const target = buildHomeUrl();
    try {
      if (token) await logoutApi({ access_token: token }).unwrap();
    } catch {
      /* ignore */
    } finally {
      dispatch(customerLogoutAction());
      window.location.replace(target);
    }
  };

  /* ----------------------------- Value ---------------------------------- */

  const value = useMemo<CustomerAuthContextType>(
    () => ({
      user,
      token,
      loading,
      error,
      userDetails: myProfile ?? null,
      businessId, // ✅ exposed (businessId or bussinessId)
      loginInit,
      register,
      confirmOtp,
      resendOtp,
      logout,
    }),
    [user, token, loading, error, myProfile, businessId]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

/* --------------------------------- Hook --------------------------------- */

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    );
  }
  return ctx;
};
