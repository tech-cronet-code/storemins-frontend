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
import { UserRoleName } from "../constants/userRoles";
import { useBusinessDetails } from "../hooks/useBusinessStoreDetails";
import { useConfirmOtp } from "../hooks/useConfirmOtp";
import { useDomain } from "../hooks/useDomainOperations";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { useGetUserDetailsQuery } from "../services/authApi";
import { logout, setUser } from "../slices/authSlice";
import { User } from "../types/authTypes";
import {
  BusinessDetailsRequestDto,
  BusinessDetailsResponseDto,
} from "../types/businessStoreTypes";
import { DomainRequestDto, DomainResponseDto } from "../types/domainTypes";

interface AuthContextType {
  user: User | null;
  userDetails: User | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchUserDetails: () => Promise<any>; // ✅ Add this line
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
  }) => Promise<{ needsOtp: boolean }>;
  confirmOtp: (code: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  createOrUpdateBusinessDetails: (
    payload: BusinessDetailsRequestDto
  ) => Promise<BusinessDetailsResponseDto>;

  checkDomainAvailability: (slug: string) => Promise<"available" | "taken">;
  saveDomain: (dto: DomainRequestDto) => Promise<DomainResponseDto>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    createOrUpdate,
    // isLoading: savingBusiness,
    // error: businessError,
  } = useBusinessDetails();

  const loginHook = useLogin();
  const registerHook = useRegister();
  const confirmOtpHook = useConfirmOtp();
  // ➊ pull in domain helpers
  const { checkDomainAvailability, saveDomain } = useDomain();

  const { data: userDetails, refetch } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });
  const userFromResponse = userDetails?.data;

  useEffect(() => {
    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.warn("Access token expired. Logging out...");
          dispatch(logout());
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Failed to decode token. Logging out...");
        dispatch(logout());
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (
      token &&
      userFromResponse &&
      userFromResponse.id &&
      (!user || user.id !== userFromResponse.id)
    ) {
      dispatch(setUser(userFromResponse));
    }
  }, [token, userDetails, user, dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogout = () => {
    dispatch(logout());
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      userDetails: userFromResponse,
      refetchUserDetails: refetch, // ✅ expose here
      login: loginHook.login,
      register: registerHook.register,
      confirmOtp: confirmOtpHook.confirm,
      logout: handleLogout,
      loading,
      error,
      createOrUpdateBusinessDetails: createOrUpdate,
      checkDomainAvailability,
      saveDomain,
    }),
    [
      user,
      userDetails,
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
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
