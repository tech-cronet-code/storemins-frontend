// ✅ src/modules/user/auth/hooks/useLogin.ts

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../common/state/store";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../../common/state/slices/authSlice";
import { useLoginMutation } from "../../../../common/services/apiClient";

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginApi, { isLoading }] = useLoginMutation();

  const login = async (email: string, password: string): Promise<void> => {
    dispatch(loginStart());
    try {
      const response = await loginApi({ email, password }).unwrap();
      dispatch(loginSuccess({ user: response.user, token: response.token }));
    } catch (error) {
      let errorMessage = "Login failed";
      if (typeof error === "object" && error !== null && "data" in error) {
        errorMessage = (error as { data: { message: string } }).data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(loginFailure(errorMessage));
    }
  };

  return {
    login,
    loading: isLoading,
  };
};