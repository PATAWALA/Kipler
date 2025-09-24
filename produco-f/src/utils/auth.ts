// src/utils/auth.ts
import { AuthUser } from "../services/authServices";

const USER_KEY = "currentUser";
const TOKEN_KEY = "token";

export function getCurrentUser(): AuthUser | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? (JSON.parse(data) as AuthUser) : null;
}

export function saveCurrentUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

// ✅ Récupérer le token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// ✅ Sauvegarder le token
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
