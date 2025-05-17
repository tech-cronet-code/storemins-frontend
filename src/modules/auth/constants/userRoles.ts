export enum UserRoleName {
    GUEST = "GUEST",
    SUPPORTAGENT = "SUPPORTAGENT",
    CUSTOMER = "CUSTOMER",
    SELLERDELIVERYBOY = "SELLERDELIVERYBOY",
    SELLERSTAFFMEMBER = "SELLERSTAFFMEMBER",
    SELLER = "SELLER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN",
  }
  
  // Optional: array if needed for dropdowns or role checks
  export const UserRolesList: UserRoleName[] = Object.values(UserRoleName);
  