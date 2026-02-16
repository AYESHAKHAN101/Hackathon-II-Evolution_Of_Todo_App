import { jwtDecode } from 'jwt-decode';

// Define JWT token interface (matches backend snake_case claims)
export interface JwtPayload {
  exp: number;
  iat: number;
  user_id: string;
  email: string;
  [key: string]: any;
}

/**
 * Authentication utilities for session management.
 * Stores JWT in both localStorage (for client-side reads) and
 * a cookie (for Next.js middleware to read on the server).
 */
export class AuthUtils {
  private static readonly TOKEN_KEY = 'jwtToken';

  /**
   * Store JWT token in localStorage AND as a cookie (for middleware)
   */
  static storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      // Also set as a cookie so Next.js middleware can read it
      document.cookie = `auth_token=${token}; path=/; max-age=${30 * 60}; SameSite=Lax`;
    }
  }

  /**
   * Retrieve JWT token from browser storage
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Remove JWT token from all storage
   */
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      // Clear the cookie too
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
  }

  /**
   * Decode JWT token to get payload
   */
  static decodeToken(token?: string): JwtPayload | null {
    if (!token) {
      token = this.getToken() ?? undefined;
    }

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Check if the JWT token is expired
   */
  static isTokenExpired(token?: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const buffer = 300; // 5 minutes buffer
    return decoded.exp - buffer < now;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Get user ID from token
   */
  static getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.user_id : null;
  }

  /**
   * Get user email from token
   */
  static getUserEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.email : null;
  }

  /**
   * Get remaining time until token expiration in seconds
   */
  static getTimeUntilExpiration(): number | null {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) {
      return null;
    }
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - now);
  }

  /**
   * Log out user - remove tokens and redirect
   */
  static logout(redirectPath: string = '/login'): void {
    this.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
  }

  /**
   * Handle session timeout (inactivity auto-logout)
   */
  static setupSessionTimeout(timeoutMinutes: number = 30): void {
    if (typeof window !== 'undefined') {
      let timeoutId: ReturnType<typeof setTimeout>;

      const resetTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log('Session timeout due to inactivity');
          this.logout();
        }, timeoutMinutes * 60 * 1000);
      };

      resetTimeout();

      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, resetTimeout, true);
      });
    }
  }
}

// Export helper functions
export const getAuthToken = AuthUtils.getToken.bind(AuthUtils);
export const isAuthenticated = AuthUtils.isAuthenticated.bind(AuthUtils);
export const getUserId = AuthUtils.getUserId.bind(AuthUtils);
export const getUserEmail = AuthUtils.getUserEmail.bind(AuthUtils);
export const logout = AuthUtils.logout.bind(AuthUtils);
