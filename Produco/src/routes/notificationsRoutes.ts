// routes/notificationRoutes.ts
import express from "express";
import {
  getUserNotifications,
  markAsRead,
  createNotification,
} from "../controllers/notificationsControllers";

const router = express.Router();

// 📌 Récupérer les notifs d’un user
router.get("/:userId/:role", getUserNotifications);

// 📌 Marquer comme lue
router.patch("/:id/read", markAsRead);

// 📌 Créer une notif manuellement (utile pour debug ou envoi admin → user)
router.post("/", async (req, res) => {
  try {
    const { type, message, userId, targetRole, data, link, productId } = req.body;

    const notif = await createNotification(type, message, {
      userId,
      targetRole,
      data,
      link,
      productId,
    });

    res.status(201).json(notif);
  } catch (err) {
    console.error("❌ createNotification route:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
