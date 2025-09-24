import { Request, Response } from "express";
import Notification, { INotification } from "../models/notifications";
import { io } from "../socket";                             


// ✅ Fonction réutilisable pour créer et diffuser une notif
export const createNotification = async (
  userId: string,
  type: INotification["type"],
  message: string,
  data: any = {}
): Promise<INotification> => {
  const notif = new Notification({
    userId,
    type,
    message,
    data,
    isRead: false,
    product: data?.productId || null,
    link: data?.link || "/user-dashboard/products", // 👈 lien cliquable
  });

  return await notif.save(); // ✅ Retourne toujours une seule notif
};

// 📌 Récupérer les notifications d’un user
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const notifs = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Marquer une notif comme lue
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
