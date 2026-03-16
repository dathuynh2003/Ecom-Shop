import { jwtDecode } from "jwt-decode";

type JwtPayloadWithUser = {
  aud: string;
  exp: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  iss: string;
};

export function getUserIdFromAccessToken(): string {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return "";

    const decoded = jwtDecode<JwtPayloadWithUser>(token);

    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]?.toString() || "";
  } catch (err) {
    return "";
  }
}

export function isTokenValid(token: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    console.log("Decoded token:", decoded.exp, "Current time:", now);
    return decoded.exp > now;
  } catch {
    return false;
  }
}
