// ✅ Updated AuthContext to use separated login/register hooks with memoized login/register

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../../../common/services/apiClient";
import {
  logout,
  setUser,
} from "../../../../common/state/slices/authSlice";
import { AppDispatch, RootState } from "../../../../common/state/store";
import { User } from "../../../../common/types/user";
import { UserRoleName } from "../constants/userRoles";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    mobile: string;
    pass_hash: string;
    role: UserRoleName;
    isTermAndPrivarcyEnable: boolean;
  }) => Promise<void>;
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
  console.log(user, "user");
  console.log(token, "token");



  const loginHook = useLogin();
  const registerHook = useRegister();

  // const { data: userDetails } = useGetUserDetailsQuery(undefined, {
  //   skip: !token,
  // });

  // const { data: userDetails } = useGetUserDetailsQuery(); // ← REMOVE skip: !token


  // useEffect(() => {
  //   if (token && userDetails && userDetails.id && (!user || user.id !== userDetails.id)) {
  //     dispatch(setUser(userDetails));
  //   }
  // }, [token, userDetails?.id, user?.id, dispatch]);


  //  Only run query *after* token is set
  const { data: userDetails, refetch } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });

  //  Watch token changes and refetch manually
  useEffect(() => {
    if (token) {
      refetch(); // 🔁 Trigger /my-profile again after token is refreshed
    }
  }, [token, refetch]);

  useEffect(() => {
    if (token && userDetails) {
      dispatch(setUser(userDetails));
    }
  }, [token, userDetails?.id]);


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
