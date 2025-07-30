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
import { useConfirmOtp } from "../hooks/useConfirmOtp";
import { useDomain } from "../hooks/useDomainOperations";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import {
  useGetUserDetailsQuery,
  useUpdateUserProfileMutation,
} from "../services/authApi";
import { logout, setUser } from "../slices/authSlice";
import { User } from "../types/authTypes";
import {
  BusinessDetailsRequestDto,
  BusinessDetailsResponseDto,
} from "../types/businessStoreTypes";
import { DomainRequestDto, DomainResponseDto } from "../types/domainTypes";
import { GetMyProfileDto } from "../types/profileTypes"; // ⬅️ new

/* ---------- Context typings ---------- */
interface AuthContextType {
  user: User | null;
  userDetails: GetMyProfileDto | undefined;          // ⬅️ updated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchUserDetails: () => Promise<any>;

  login: (
    email: string,
    password: string
  ) => Promise<{
    needsOtp: boolean;
    role: UserRoleName[] | UserRoleName;
  }>;

  register: (payload: {
    name: string;
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
  updateProfile: (name: string, imageId: string) => Promise<void>;
}

/* ---------- Provider ---------- */
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [quickLoginEnabledFlag, setQuickLoginEnabledFlag] = useState(false);

  const { createOrUpdate } = useBusinessDetails();
  const loginHook = useLogin();
  const registerHook = useRegister(setQuickLoginEnabledFlag);
  const confirmOtpHook = useConfirmOtp();
  const { checkDomainAvailability, saveDomain } = useDomain();

  const {
    data: userDetails,
    refetch,
  } = useGetUserDetailsQuery(undefined, { skip: !token });

  const userFromResponse = userDetails;

  /* ---------- token expiry watchdog ---------- */
  useEffect(() => {
    if (!token) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.warn("Access token expired. Logging out…");
        dispatch(logout());
      }
    } catch {
      console.error("Failed to decode token. Logging out…");
      dispatch(logout());
    }
  }, [token, dispatch]);

  /* ---------- re-fetch profile whenever token changes ---------- */
  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  /* ---------- sync profile → Redux auth.user ---------- */
  useEffect(() => {
 if (
  token &&
  userFromResponse?.id &&
  (!user || user.id !== userFromResponse.id)
) {
  const mappedUser: User = {
    ...userFromResponse,
    role: userFromResponse.role as UserRoleName[], // ✅ optional cast
    storeLinks: userFromResponse.storeLinks,       // ✅ now valid
  };

  dispatch(setUser(mappedUser));
}
  }, [token, userFromResponse, user, dispatch]);

  /* ---------- logout handler ---------- */
  const handleLogout = () => {
    const persistedQuickLogin = localStorage.getItem("quick_login_enabled");
    dispatch(logout());
    if (persistedQuickLogin) {
      setTimeout(() => {
        localStorage.removeItem("quick_login_enabled");
        window.location.href = "/home";
      }, 100);
    }
  };

  /* ---------- update profile ---------- */
  const [updateUserProfileApi] = useUpdateUserProfileMutation();

  const updateProfile = async (name: string): Promise<void> => {
    await updateUserProfileApi({ name }).unwrap();
    await refetch();
  };

  /* ---------- memoised context ---------- */
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      userDetails: userFromResponse,
      refetchUserDetails: refetch,
      login: loginHook.login,
      register: registerHook.register,
      confirmOtp: confirmOtpHook.confirm,
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
      userFromResponse,
      refetch,
      loginHook.login,
      registerHook.register,
      confirmOtpHook.confirm,
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
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/* ---------- hook ---------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
