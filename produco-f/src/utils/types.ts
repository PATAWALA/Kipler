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
  user: string; 
  type: "like" | "new_product" | "block" | "unblock";
  message: string;
  read: boolean;
  createdAt: string;
  link?:string
};
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