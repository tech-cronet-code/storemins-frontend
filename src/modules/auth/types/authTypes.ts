import { UserRoleName } from "../constants/userRoles";

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
  role?: UserRoleName[] | UserRoleName; // ✅ changed from UserRoleName to UserRoleName[]
  permissions?: string[];
  refresh_token?: string;
  mobile_confirmed?: boolean; // ✅ Add this
  otpExpiresAt?: string; // ✅ add this
  storeLinks?: StoreLink[];
  isDomainLinked?: boolean;
};

export interface StoreLink {
  id:          string;
  userId:      string;
  businessId:  string;
  role:        string;
  tenantId:    string;
}

  
// export type GetMyProfileDto = {
//   id: string;
//   name: string;
//   mobile: string;
//   tenantId: string | null;
//   storeLinks: object[];
//   role: string[];
// }
