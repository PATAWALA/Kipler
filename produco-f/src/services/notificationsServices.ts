import { api } from "../utils/api";
import { NotificationType } from "../utils/types";

// 🔹 Récupérer les notifications pour l'utilisateur courant
export async function getMyNotifications(userId: string, role: "user" | "admin"): Promise<NotificationType[]> {
  try {
    const res = await api.get(`/notifications/${userId}/${role}`);
    return res.data;
  } catch (err) {
    console.error("Erreur getMyNotifications:", err);
    return [];
  }
}

// 🔹 Marquer une notification comme lue
export async function markNotificationAsRead(id: string): Promise<NotificationType> {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
}

// 🔹 Supprimer une notification (optionnel)
export async function deleteNotification(id: string) {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
}

// 🔹 Récupérer toutes les notifications (admin)
export async function fetchAllNotifications(): Promise<NotificationType[]> {
  try {
    const res = await api.get("/notifications");
    return res.data;
  } catch (err) {
    console.error("Erreur fetchAllNotifications:", err);
    return [];
  }
}
