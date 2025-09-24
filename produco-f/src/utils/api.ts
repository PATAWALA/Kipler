// src/utils/api.ts
import axios from "axios";
import { getToken } from "./auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Instance Axios
export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Intercepteur pour ajouter automatiquement le token JWT
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🔹 Exemple: récupérer tous les utilisateurs
export async function getUsers() {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    console.error("Erreur getUsers:", err);
    return [];
  }
}

// 🔹 Exemple: récupérer tous les produits
export async function getProducts() {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (err) {
    console.error("Erreur getProducts:", err);
    return [];
  }
}

// 🔹 Exemple: récupérer total du wallet
export async function getWalletTotal() {
  try {
    const res = await api.get("/wallet");
    return res.data as { total: number };
  } catch (err) {
    console.error("Erreur getWalletTotal:", err);
    return { total: 0 };
  }
}
