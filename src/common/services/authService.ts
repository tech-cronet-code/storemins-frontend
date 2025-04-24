// import { jwtDecode } from "jwt-decode";
// export function isTokenExpired(token: string): boolean {
//     try {
//       const decoded = jwtDecode<{ exp: number }>(token);
//       return decoded.exp * 1000 < Date.now();
//     } catch {
//       return true; // assume expired if invalid
//     }
//   }