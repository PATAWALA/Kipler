// notificationsContext.ts
import { createContext } from "react";
import { NotificationType } from "../utils/types";

export interface NotificationContextType {
  notifications: NotificationType[];
  loading: boolean;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

// 👇 Context séparé
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
