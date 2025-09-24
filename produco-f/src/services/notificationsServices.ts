import { api } from "../utils/api";
import { NotificationType } from "../utils/types";

// 🔹 Récupérer mes notifications
export async function getMyNotifications(): Promise<NotificationType[]> {
  const res = await api.get("/notifications/me");
  return res.data;
}

// 🔹 Marquer une notif comme lue
export async function markNotificationAsRead(id: string): Promise<NotificationType> {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
}

// 🔹 Supprimer une notif (optionnel)
export async function deleteNotification(id: string) {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

// ✅ Récupérer toutes les notifs
export async function fetchNotifications(): Promise<NotificationType[]> {
  try {
    const res = await api.get("/notifications");
    return res.data;
  } catch (err) {
    console.error("Erreur fetchNotifications:", err);
    return [];
  }
}