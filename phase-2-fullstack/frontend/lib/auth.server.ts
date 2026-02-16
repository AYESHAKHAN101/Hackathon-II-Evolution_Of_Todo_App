"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export interface JwtPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("auth_token");
  const token = tokenObj?.value;

  if (!token) {
    return null;
  }

  try {
    // In a real app, you'd use the actual secret from environment variables
    // For now, we'll use a placeholder - this should match the backend's BETTER_AUTH_SECRET
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET || "fallback_secret_for_dev");
    const verified = await jwtVerify(token, secret);

    return verified.payload as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function requireAuth() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/login");
    }

    return user;
  } catch (error) {
    console.error("Error in requireAuth:", error);
    redirect("/login");
  }
}

export async function isAuthenticated() {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

