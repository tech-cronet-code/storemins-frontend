// src/modules/auth/services/authService.ts

import { User } from "../../../../common/types/user";

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: "1", email, role: "admin" }, // Mock user data
        });
      }, 1000);
    });
  },
};
