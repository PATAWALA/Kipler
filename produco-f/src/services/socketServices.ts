import { io, Socket } from "socket.io-client";
import { NotificationType } from "../utils/types";

let socket: Socket | null = null;

export const initSocket = (userId: string, role?: "user" | "admin") => {
  if (socket && socket.connected) return;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("🔌 [CLIENT] Connecté au serveur socket :", socket?.id);

    // Rejoindre la room globale
    socket?.emit("joinAll");
    console.log("🌍 [CLIENT] Rejoint la room 'all'");

    // Rejoindre la room perso
    if (userId) {
      socket?.emit("join", userId);
      console.log(`📌 [CLIENT] Rejoint la room ${userId}`);
    }

    // Rejoindre la room "admin" si rôle admin
    if (role === "admin") {
      socket?.emit("joinAdmin");
      console.log(`👑 [CLIENT] Admin ${socket?.id} a rejoint la room "admin"`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ [CLIENT] Déconnecté du serveur socket");
  });
};


/**
 * S'abonner aux notifications temps réel
 */
export const subscribeNotifications = (cb: (notif: NotificationType) => void) => {
  if (!socket) return;
  socket.on("newNotification", (notif: NotificationType) => {
    console.log("📥 [CLIENT] Nouvelle notif reçue :", notif);
    cb(notif);
  });
};

/**
 * Se désabonner des notifications
 */
export const unsubscribeNotifications = () => {
  if (!socket) return;
  socket.off("newNotification");
};

/**
 * Émettre un événement au serveur (typé générique)
 */
export const emitEvent = <T = unknown>(event: string, payload: T) => {
  if (!socket) return;
  socket.emit(event, payload);
};
