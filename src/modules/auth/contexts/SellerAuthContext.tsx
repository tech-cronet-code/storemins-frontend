import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../common/state/store";
import { UserRoleName } from "../constants/userRoles";
import { useBusinessDetails } from "../hooks/useBusinessStoreDetails";
import { useDomain } from "../hooks/useDomainOperations";
import {
  useGetUserDetailsQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserProfileMutation,
} from "../services/sellerApi";
import {
  confirmOtpSuccess as sellerConfirmOtpSuccess,
  loginSuccess as sellerLoginSuccess,
  logout as sellerLogout,
  setUser as setSellerUser,
  registerSuccess as sellerRegisterSuccess,
} from "../slices/sellerAuthSlice";
import { User } from "../types/authTypes";
import {
  BusinessDetailsRequestDto,
  BusinessDetailsResponseDto,
} from "../types/businessStoreTypes";
import { DomainRequestDto, DomainResponseDto } from "../types/domainTypes";
import { GetMyProfileDto } from "../types/profileTypes";

interface AuthContextType {
  user: User | null;
  /** Always an array when present, normalized from user.role */
  rolesArray: UserRoleName[] | undefined;
  userDetails: GetMyProfileDto | undefined;
  refetchUserDetails: () => Promise<any>;

  login: (
    mobile: string,
    password: string
  ) => Promise<{ needsOtp: boolean; role: UserRoleName[] | UserRoleName }>;

  register: (payload: {
    // name: string;
    mobile: string;
    pass_hash: string;
    role: UserRoleName;
    isTermAndPrivarcyEnable: boolean;
  }) => Promise<{ needsOtp: boolean; quickLoginEnable: boolean }>;

  confirmOtp: (code: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;

  createOrUpdateBusinessDetails: (
    payload: BusinessDetailsRequestDto
  ) => Promise<BusinessDetailsResponseDto>;

  checkDomainAvailability: (slug: string) => Promise<"available" | "taken">;
  saveDomain: (dto: DomainRequestDto) => Promise<DomainResponseDto>;

  quickLoginEnabledFlag: boolean;
  updateProfile: (name: string, avatarFile?: File) => Promise<void>;
}

const SellerAuthContext = createContext<AuthContextType | null>(null);

export const SellerAuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (s: RootState) => s.sellerAuth
  );

  // mirror of "quick_login_enabled" used by your old flow
  const [quickLoginEnabledFlag, setQuickLoginEnabledFlag] = useState<boolean>(
    () => localStorage.getItem("quick_login_enabled") === "true"
  );

  const { createOrUpdate } = useBusinessDetails();
  const { checkDomainAvailability, saveDomain } = useDomain();

  const [updateUserProfileApi] = useUpdateUserProfileMutation();
  const [loginApi] = useLoginMutation();
  const [registerApi] = useRegisterMutation();

  const { data: userDetails, refetch } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });

  // normalize roles everywhere
  const rolesArray = useMemo<UserRoleName[] | undefined>(() => {
    if (!user || user.role == null) return undefined;
    return Array.isArray(user.role)
      ? (user.role as UserRoleName[])
      : ([user.role] as UserRoleName[]);
  }, [user]);

  // token expiry watchdog
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token) as { exp?: number } | undefined;
      const now = Date.now() / 1000;
      if (decoded?.exp && decoded.exp < now) dispatch(sellerLogout());
    } catch {
      dispatch(sellerLogout());
    }
  }, [token, dispatch]);

  // refetch profile when token changes
  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  // sync profile → Redux auth.user
  useEffect(() => {
    if (token && userDetails?.id && (!user || user.id !== userDetails.id)) {
      const mapped: User = {
        ...userDetails,
        role: userDetails.role as UserRoleName[],
        storeLinks: userDetails.storeLinks,
      } as unknown as User;
      dispatch(setSellerUser(mapped));
    }
  }, [token, userDetails, user, dispatch]);

  // logout (keeps old behavior with quick_login_enabled)
  const handleLogout = () => {
    const persistedQuickLogin = localStorage.getItem("quick_login_enabled");
    // clear pending data
    sessionStorage.removeItem("seller_pending_mobile");
    sessionStorage.removeItem("seller_pending_user_id");

    dispatch(sellerLogout());
    if (persistedQuickLogin) {
      setTimeout(() => {
        localStorage.removeItem("quick_login_enabled");
        setQuickLoginEnabledFlag(false);
        window.location.href = "/home";
      }, 100);
    } else {
      window.location.href = "/home";
    }
  };

  // profile update
  const updateProfile = async (name: string, avatarFile?: File) => {
    const form = new FormData();
    form.append("name", name);
    if (avatarFile) form.append("avatar", avatarFile);
    await updateUserProfileApi(form).unwrap();
    await refetch();
  };

  // login
  const login = async (mobile: string, password: string) => {
    const res = await loginApi({ mobile, password }).unwrap();
    const qi = (res?.data?.quickLoginInfo ?? {}) as {
      id?: string;
      name?: string;
      mobile?: string;
      role?: UserRoleName[] | UserRoleName;
      permissions?: string[];
      mobile_confirmed?: boolean;
      access_token?: string;
      refresh_token?: string | null;
    };

    // Persist pending for OTP page regardless of BE response completeness
    sessionStorage.setItem("seller_pending_mobile", qi.mobile ?? mobile);
    if (qi.id) sessionStorage.setItem("seller_pending_user_id", qi.id);

    dispatch(
      sellerLoginSuccess({
        user: {
          id: qi.id ?? "",
          name: qi.name ?? "",
          mobile: qi.mobile ?? mobile,
          role: (qi.role ?? []) as User["role"],
          permissions: qi.permissions ?? [],
          mobile_confirmed: qi.mobile_confirmed ?? false,
        } as User,
        token: qi.access_token ?? "",
        refreshToken: qi.refresh_token ?? null,
      })
    );

    const needsOtp = !!res?.data?.needs_confirm_otp_code;
    if (needsOtp) {
      localStorage.setItem("quick_login_enabled", "true");
      setQuickLoginEnabledFlag(true);
    }

    return {
      needsOtp,
      role: (qi.role ?? []) as UserRoleName[] | UserRoleName,
    };
  };

  // register
  const register = async (payload: {
    name: string;
    mobile: string;
    pass_hash: string;
    role: UserRoleName;
    isTermAndPrivarcyEnable: boolean;
  }) => {
    const res = await registerApi(payload).unwrap();

    const needsOtp = !!res?.needs_confirm_otp_code;
    const quickLoginEnable = !!res?.quickLoginEnable;

    // quick_login_enabled parity with old flow
    if (quickLoginEnable || needsOtp) {
      localStorage.setItem("quick_login_enabled", "true");
      setQuickLoginEnabledFlag(true);
    } else {
      localStorage.removeItem("quick_login_enabled");
      setQuickLoginEnabledFlag(false);
    }

    // if BE returns quickRegisterInfo with tokens → persist them
    const qi = (res?.quickRegisterInfo ?? null) as {
      id?: string;
      name?: string;
      mobile?: string;
      role?: UserRoleName[] | UserRoleName;
      permissions?: string[];
      mobile_confirmed?: boolean;
      access_token?: string | null;
      refresh_token?: string | null;
      otpExpiresAt?: string | null;
    } | null;

    // Always persist pending mobile/userId for OTP page (even if BE doesn't return qi)
    sessionStorage.setItem(
      "seller_pending_mobile",
      qi?.mobile ?? payload.mobile
    );
    if (qi?.id) sessionStorage.setItem("seller_pending_user_id", qi.id);

    if (qi?.id) {
      dispatch(
        sellerRegisterSuccess({
          user: {
            id: qi.id ?? "",
            name: qi.name ?? "",
            mobile: qi.mobile ?? payload.mobile,
            role: (qi.role ?? []) as User["role"],
            permissions: qi.permissions ?? [],
            mobile_confirmed: qi.mobile_confirmed ?? false,
            otpExpiresAt: qi.otpExpiresAt ?? undefined,
          } as User,
          token: qi.access_token ?? null,
          refreshToken: qi.refresh_token ?? null,
          needsOtp,
          quickLoginEnable,
        })
      );
    }

    return { needsOtp, quickLoginEnable };
  };

  // confirm OTP (uses pending fallback)
  const confirmOtp = async (code: string) => {
    const pendingMobile = sessionStorage.getItem("seller_pending_mobile") ?? "";
    const mobile = user?.mobile || pendingMobile;
    if (!mobile) throw new Error("No mobile number available for OTP confirm.");

    const resp = await fetch(`/auth/confirm-mobile-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, confirm_mobile_otp_code: code }),
      credentials: "include",
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "OTP confirmation failed");
      throw new Error(err || "OTP confirmation failed");
    }

    // Cleanup pending + set confirmed
    dispatch(sellerConfirmOtpSuccess({ mobile_confirmed: true }));
    localStorage.removeItem("quick_login_enabled");
    setQuickLoginEnabledFlag(false);
    sessionStorage.removeItem("seller_pending_mobile");
    sessionStorage.removeItem("seller_pending_user_id");
  };

  const ctx = useMemo<AuthContextType>(
    () => ({
      user,
      rolesArray,
      userDetails,
      refetchUserDetails: refetch,
      login,
      register,
      confirmOtp,
      logout: handleLogout,
      loading,
      error,
      createOrUpdateBusinessDetails: createOrUpdate,
      checkDomainAvailability,
      saveDomain,
      quickLoginEnabledFlag,
      updateProfile,
    }),
    [
      user,
      rolesArray,
      userDetails,
      refetch,
      login,
      register,
      confirmOtp,
      handleLogout,
      loading,
      error,
      createOrUpdate,
      checkDomainAvailability,
      saveDomain,
      quickLoginEnabledFlag,
      updateProfile,
    ]
  );

  return (
    <SellerAuthContext.Provider value={ctx}>
      {children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => {
  const ctx = useContext(SellerAuthContext);
  if (!ctx)
    throw new Error("useSellerAuth must be used within a SellerAuthProvider");
  return ctx;
};
