import { useState, useEffect, ReactNode } from "react";
import { NotificationType } from "../utils/types";
import { NotificationContext } from "./notificationsContext";
import { fetchNotifications } from "../services/notificationsServices";
import { subscribeNotifications, unsubscribeNotifications, initSocket } from "../services/socketServices";

interface NotificationsProviderProps {
  children: ReactNode;
  userId: string; 
}

export function NotificationsProvider({ children, userId }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    // Charger les notifs déjà existantes
    async function loadNotifications() {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur chargement notifs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();

    // ⚡ Initialiser socket et rejoindre la room
    initSocket(userId);

    // S'abonner aux notifs temps réel
    const handleNewNotification = (notif: NotificationType) => {
      setNotifications((prev) => [notif, ...prev]);
    };
    subscribeNotifications(handleNewNotification);

    return () => {
      unsubscribeNotifications();
    };
  }, [userId]);

      const markAsRead = (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}
