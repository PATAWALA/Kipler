import axios from "axios";
import { getAuthHeader } from "./productServices";

const API_URL = "http://localhost:5000/api/users";
const PRODUCT_API_URL = "http://localhost:5000/api/products"; // ajout pour les produits

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;
  darkMode?: boolean;
  photo?: string;
  phone?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  phone?: string;
}

export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  status: "en_attente" | "approuvé" | "supprimé";
  author?: {
    _id: string;
    name: string;
  };
  user?: string;
}

// -------------------
// 🔹 Inscription
// -------------------
export async function registerUser(user: RegisterData): Promise<AuthUser> {
  const res = await axios.post(`${API_URL}/register`, user);
  const data: AuthUser = res.data;
  saveUser(data);
  saveToken(data.token);
  return data;
}

// -------------------
// 🔹 Connexion
// -------------------
export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  const data: AuthUser = res.data;
  saveUser(data);
  saveToken(data.token);
  return data;
}

// -------------------
// 🔹 Sauvegarder user / token
// -------------------
export function saveUser(user: AuthUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

//Avoir accès a tout les users .
export async function getUsers(): Promise<AuthUser[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token introuvable");

  const res = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}


// Bloquer un utilisateur
export async function blockUser(userId: string) {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${userId}/block`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
// Débloquer un utilisateur
export async function unblockUser(userId: string) {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${userId}/unblock`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
// -------------------
// 🔹 Supprimer un user (admin)
// -------------------
export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}

// -------------------
// 🔹 Déconnexion
// -------------------
export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// -------------------
// 🔹 Récupérer les produits d’un utilisateur
// -------------------
export async function getUserProducts(userId: string): Promise<ProductType[]> {
  const res = await axios.get(`${PRODUCT_API_URL}/user/${userId}`);
  return res.data;
}

// 🔹 Supprimer un produit en tant qu’admin
export async function deleteProductByAdmin(productId: string): Promise<{ message: string }> {
  const res = await axios.delete(`${PRODUCT_API_URL}/admin/${productId}`, {
    headers: getAuthHeader(), // ✅ on envoie bien le token
  });
  return res.data;
};

