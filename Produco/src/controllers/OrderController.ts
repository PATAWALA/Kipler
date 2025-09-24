import { RequestHandler } from "express";
import Order from "../models/Order";
import Product from "../models/produit";
import { AuthRequest } from "../utils/middleware/authMiddleware";

// Créer une commande
export const createOrder: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { productId, guestInfo } = req.body;
    const userId = req.user?._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    const order = new Order({
      product: product._id,
      seller: product.user,
      buyer: userId || undefined,
      guestInfo: !userId ? guestInfo : undefined,
    });

    await order.save();

    // 🔥 Incrémenter ordersCount
    product.ordersCount = (product.ordersCount || 0) + 1;
    await product.save();

    return res.status(201).json(order);
  } catch (err: any) {
    console.error("Erreur createOrder:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Récupérer les commandes d’un vendeur
export const getSellerOrders: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const sellerId = req.user?._id;
    const orders = await Order.find({ seller: sellerId })
      .populate("product", "name price image")
      .populate("buyer", "name email phone");

    res.json(orders);
  } catch (err: any) {
    console.error("Erreur getSellerOrders:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
