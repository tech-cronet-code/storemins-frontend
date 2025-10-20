// src/modules/user/auth/hooks/useSellerAuth.ts

import { useSellerAuth } from "../contexts/SellerAuthContext";

export const useAuthHook = () => {
  return useSellerAuth();
};
