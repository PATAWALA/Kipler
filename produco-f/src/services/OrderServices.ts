import axios from "axios";
import { getAuthHeader } from "../services/productServices";
import { ProductType } from "./productServices";

export interface OrderType {
  _id: string;
  product: ProductType;
  buyer?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  guestInfo?: {
    name: string;
    phone: string;
  };
  createdAt: string;
}

// Récupérer les commandes du vendeur connecté
export async function getSellerOrders(): Promise<OrderType[]> {
  try {
    const res = await axios.get<{ orders: OrderType[] }>(
      `${process.env.REACT_APP_API_URL}/orders/mine`,
      { headers: getAuthHeader() }
    );
    return res.data.orders || [];
  } catch (err) {
    console.error("Erreur getSellerOrders:", err);
    return [];
  }
}

// Créer une commande
export async function createOrder(
  productId: string,
  guestInfo?: { name: string; phone: string }
) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/orders`,
      { productId, guestInfo },
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error("Erreur createOrder:", err);
    throw err;
  }
}
