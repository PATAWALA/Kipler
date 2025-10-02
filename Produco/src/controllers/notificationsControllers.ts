import { Request, Response } from "express";
import Notification, { INotification } from "../models/notifications";
import { emitNotification } from "../socket";

// ✅ Créer et émettre une notification
export const createNotification = async (
  type: INotification["type"],
  message: string,
  options: {
    userId?: string;              // auteur de l’action
    targetRole?: "admin" | "user" | "all";
    data?: any;
    link?: string;
    productId?: string;
    excludeUserId?: string;       // 🔥 exclure le créateur en temps réel
  } = {}
): Promise<INotification> => {
  // 🔹 Création MongoDB
  const notif = new Notification({
    userId: options.userId || undefined,
    targetRole: options.targetRole || "user",
    type,
    message,
    data: options.data || {},
    isRead: false,
    product: options.productId || undefined,
    link: options.link || "/user-dashboard/products",
  });

  const saved = await notif.save();

  // 🔹 Diffusion socket
  switch (options.targetRole) {
    case "all":
      emitNotification("all", saved, { excludeUserId: options.excludeUserId || options.userId });
      break;
    case "admin":
      emitNotification("admin", saved, { excludeUserId: options.excludeUserId || options.userId });
      break;
    case "user":
      emitNotification("user", saved, { excludeUserId: options.excludeUserId || options.userId });
      break;
    default:
      if (options.userId) emitNotification(options.userId, saved); // notif ciblée
      break;
  }

  return saved;
};


// 🔹 Récupérer toutes les notifications d’un utilisateur
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.params;

    // 👉 Chercher toutes les notifs qui concernent :
    // - le userId en question
    // - OU envoyées au rôle global ("all")
    // - OU envoyées au rôle du user (user/admin)
    const notifications = await Notification.find({
      $or: [
        { userId },                  // notifs perso
        { targetRole: "all" },       // notifs globales
        { targetRole: role },        // notifs pour son rôle
      ],
    })
      .sort({ createdAt: -1 }); // 🔥 plus récentes d'abord

    res.json(notifications);
  } catch (err) {
    console.error("❌ getUserNotifications:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Marquer une notif comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notif) return res.status(404).json({ message: "Notification introuvable" });

    res.json(notif);
  } catch (err) {
    console.error("❌ markAsRead:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
