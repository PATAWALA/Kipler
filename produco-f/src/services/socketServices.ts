// services/socketServices.ts
import { io, Socket } from "socket.io-client";
import { NotificationType } from "../utils/types";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (socket) return;
  socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

  socket.on("connect", () => {
    console.log("🔌 [CLIENT] Connecté au serveur socket");
    socket?.emit("join", userId);
    console.log(`📌 [CLIENT] Rejoint la room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ [CLIENT] Déconnecté du serveur socket");
  });
};

export const subscribeNotifications = (cb: (notif: NotificationType) => void) => {
  socket?.on("newNotification", (notif) => {
    console.log("📥 [CLIENT] Nouvelle notif reçue :", notif);
    cb(notif);
  });
};

export const unsubscribeNotifications = () => {
  socket?.off("newNotification");
};
