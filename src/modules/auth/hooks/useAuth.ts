// src/modules/user/auth/hooks/useAuth.ts
import { useAuth } from "../contexts/AuthContext";

export const useAuthHook = () => {
  return useAuth();
};
