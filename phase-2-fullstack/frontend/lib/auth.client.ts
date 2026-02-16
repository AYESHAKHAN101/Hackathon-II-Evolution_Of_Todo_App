import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export function parseToken(token: string) {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwtToken");
  }
  return null;
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwtToken", token);
    // Also save user email from the token
    const payload = getTokenPayload(token);
    if (payload && payload.email) {
      localStorage.setItem("userEmail", payload.email);
    }
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwtToken");
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp! < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

export function getTokenPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getStoredToken();
  if (!token) {
    return false;
  }
  return !isTokenExpired(token);
}
