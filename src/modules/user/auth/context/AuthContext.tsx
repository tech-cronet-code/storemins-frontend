import { createContext, useContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../common/state/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
} from "../../../../common/state/slices/authSlice";
import {
  useGetUserDetailsQuery,
  useLoginMutation,
} from "../../../../common/services/apiClient";
import { User } from "../../../../common/types/user";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [loginApi] = useLoginMutation();

  const { data: userDetails } = useGetUserDetailsQuery();

  // Fetch user details on app load
  useEffect(() => {
    if (userDetails) {
      dispatch(setUser(userDetails));
    }
  }, [userDetails, dispatch]);

  const handleLogin = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      const response = await loginApi({ email, password }).unwrap();
      // response now contains both user and token
      dispatch(loginSuccess({ user: response.user, token: response.token }));
    } catch (err) {
      console.log(err, "err");
      // Handle the 'unknown' type error
      let errorMessage = "Login failed";
      if (typeof err === "object" && err !== null && "data" in err) {
        errorMessage = (err as { data: { message: string } }).data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, logout: handleLogout, loading, error }}
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
