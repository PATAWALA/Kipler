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
// types.ts ou utils/types.ts
export interface NotificationData {
  creatorId?: string;   // ⚡ utilisé pour filtrer l'auteur
  productId?: string;   // ex: pour un produit lié à la notif
  orderId?: string;     // ex: pour une commande
  messageId?: string;   // ex: pour un chat
  [key: string]: unknown; // extensible sans casser le typage
}

export type NotificationKind =
  | "new_product"
  | "message"
  | "order_status"
  | "like"
  | "views"
  | "system"
  | "approve"
  | "block"
  | "new_user"; // ajoute au fur et à mesure tes autres types

export interface NotificationType {
  _id: string;
  message: string;
  type: NotificationKind;
  link?: string;
  isRead: boolean;
  createdAt: string;
  targetRole?: "admin" | "user" | "all";
  userId?: string; 
  data?: NotificationData;
  autoDismiss?: number
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