// src/common/types/user.ts
export type User = {
  id: string;
  email: string;
  role: "admin" | "seller" | "customer";
};
