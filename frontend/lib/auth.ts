// lib/auth.ts
import { jwtDecode } from "jwt-decode";
import { User } from "./types";

interface JWTPayload {
  user_id: string;
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
};

export const getUserFromToken = (): User | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload: JWTPayload = jwtDecode(token);
    const now = Date.now() / 1000;
    if (payload.exp < now) {
      removeToken();
      return null;
    }
    return { id: payload.user_id, email: "" }; // email not in JWT
  } catch {
    removeToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getUserFromToken() !== null;
};