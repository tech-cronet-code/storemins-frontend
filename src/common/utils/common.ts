import { UserRoleName } from "../../modules/auth/constants/userRoles";

  // Helper function to map string[] to UserRoleName[]
  export const castToUserRoles = (roles: string[] = []): UserRoleName[] => {
    return roles
      .map((role) => {
        if (Object.values(UserRoleName).includes(role as UserRoleName)) {
          return role as UserRoleName;
        }
        return null;
      })
      .filter(Boolean) as UserRoleName[];
  }; 