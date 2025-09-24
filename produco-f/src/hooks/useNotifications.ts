import { useContext } from "react";
import { NotificationContext, NotificationContextType } from "../context/notificationsContext";

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications doit être utilisé dans NotificationsProvider");
  }
  return ctx;
}
