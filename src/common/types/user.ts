import { UserRoleName } from "../../modules/user/auth/constants/userRoles";

// src/common/types/user.ts
export type User = {
  id: string;
  name: string;
  mobile: string;
  pwd_hash?: string;
  imageId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tenantId?: string | null;
  role?: UserRoleName;
  permissions?: string[];
};
