// routes/notificationRoutes.ts
import express from "express";
import { getUserNotifications, markAsRead } from "../controllers/notificationsControllers";

const router = express.Router();

// 📌 Récupérer les notifs d’un user
router.get("/:userId", getUserNotifications);

// 📌 Marquer comme lue
router.patch("/:id/read", markAsRead);

export default router;
