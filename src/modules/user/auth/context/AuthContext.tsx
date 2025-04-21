// ✅ Updated AuthContext to use separated login/register hooks

import { createContext, ReactNode, useContext, useEffect } from "react";
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
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const { login } = useLogin();
  const { register } = useRegister();

  const { data: userDetails } = useGetUserDetailsQuery();

  useEffect(() => {
    if (userDetails) {
      dispatch(setUser(userDetails));
    }
  }, [userDetails, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout: handleLogout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
