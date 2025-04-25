import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../../../common/services/apiClient";
import { logout, setUser } from "../../../../common/state/slices/authSlice";
import { AppDispatch, RootState } from "../../../../common/state/store";
import { User } from "../../../../common/types/user";
import { UserRoleName } from "../constants/userRoles";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
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
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const loginHook = useLogin();
  const registerHook = useRegister();

  const { data: userDetails, refetch } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          console.warn("Access token expired. Logging out...");
          dispatch(logout());
        }
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
    if (token && userDetails && userDetails.id && (!user || user.id !== userDetails.id)) {
      dispatch(setUser(userDetails));
    }
  }, [token, userDetails, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      login: loginHook.login,
      register: registerHook.register,
      logout: handleLogout,
      loading,
      error,
    }),
    [user, loginHook.login, registerHook.register, handleLogout, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
