import { Server } from "socket.io";
import { INotification } from "./models/notifications";

let io: Server;

// ✅ Initialisation du socket
export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("✅ [SOCKET] Connexion :", socket.id);

    // Joindre une "room" spécifique à l’utilisateur
    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`📌 [SOCKET] User ${userId} a rejoint la room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ [SOCKET] Déconnexion : ${socket.id}`);
    });
  });

  return io;
};

// ✅ Getter global de io
export const getIO = (): Server => {
  if (!io) {
    throw new Error("⚠️ Socket.IO n'est pas encore initialisé !");
  }
  return io;
};

// ✅ Émettre une notification à un utilisateur
export const emitNotification = (userId: string, notif: INotification) => {
  if (!io) return;
  console.log(`📤 [SOCKET] Envoi notif à user ${userId} :`, notif.message);
  io.to(userId).emit("newNotification", notif);
};

export { io }; // 👈 permet d'importer io directement
