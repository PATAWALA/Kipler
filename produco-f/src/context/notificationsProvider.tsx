// notificationsProvider.tsx
import { ReactNode, useEffect, useState } from "react";
import { NotificationContext } from "./notificationsContext";
import { NotificationType } from "../utils/types";
import { initSocket, subscribeNotifications, unsubscribeNotifications } from "../services/socketServices";

interface Props {
  children: ReactNode;
  userId?: string; // facultatif si non connecté
  role: "user" | "admin";
}

export const NotificationProvider = ({ children, userId, role }: Props) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialiser le socket quand userId/role est disponible
  useEffect(() => {
    if (!userId) {
      setLoading(false); // Pas de user => juste loader false
      return;
    }

    initSocket(userId, role);

    const handleNotif = (notif: NotificationType) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    subscribeNotifications(handleNotif);

    setLoading(false);

    return () => {
      unsubscribeNotifications();
    };
  }, [userId, role]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
