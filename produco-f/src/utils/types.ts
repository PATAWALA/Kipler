// types.ts

// Interface des User
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;      
  photo?: string;      
  darkMode?: boolean;
  phone?: string; 
  status?: "blocked"|"active";
  createdAt: string;
};
// Interfaces des notifs
export interface NotificationType {
  _id: string;
  message: string;
  type: 
    | "new_product"
    | "message"
    | "order_status"
    | "like"
    | "views"
    | "system"; // pour d’autres cas
  link?: string;
  read: boolean;
  createdAt: string;
  targetRole?: "admin" | "user" | "all"; // 👈 Pour préciser la cible
  userId?: string; // si c’est lié à un user spécifique
}

// Interface des Prouidts
export interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  user?: string;
  phone?: string;
  status?: "approuvé" | "en_attente" | "rejeté"|"supprimé";
}

export type UserTab = "dashboard" | "products" | "settings" | "gains" | "contact" | "market";
export type AdminTab = "dashboard" | "users" | "settings"| "publish" | "products"| "wallet"| "contact"| "about"|"admingestion";