import { Server } from "socket.io";
import { INotification } from "./models/notifications";

let io: Server;

/**
 * Initialiser Socket.IO
 */
export const initSocket = (server: any) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("✅ [SOCKET] Connexion :", socket.id);

    // ⚡ Rejoindre sa room perso
    socket.on("join", (userId: string) => {
      socket.join(userId);
      (socket as any).userId = userId.toString();
      console.log(`📌 User ${userId} a rejoint sa room`);
    });

    // Room admin
    socket.on("joinAdmin", () => {
      socket.join("admin");
      console.log(`👑 Admin ${socket.id} a rejoint la room "admin"`);
    });

    // Room globale "all"
    socket.on("joinAll", () => {
      socket.join("all");
      console.log(`🌍 ${socket.id} a rejoint la room "all"`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Déconnexion : ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error("⚠️ Socket.IO n'est pas encore initialisé !");
  return io;
};

/**
 * Émettre une notification en excluant un utilisateur
 */
export const emitNotification = (
  target: string,
  notif: INotification,
  options?: { excludeUserId?: string }
) => {
  if (!io) return;
  const excludeId = options?.excludeUserId?.toString();

  // ⚡ Filtrer et émettre
  const emitToRoom = (room: string) => {
    const socketsInRoom = io.sockets.adapter.rooms.get(room);
    if (!socketsInRoom) return;

    socketsInRoom.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (!socket) return;

      // ❌ Exclure l’auteur
      if (String((socket as any).userId) !== excludeId) {
        socket.emit("newNotification", notif);
      }
    });
  };

  switch (target) {
    case "all":
      // Émettre à tous les utilisateurs connectés sauf l’auteur
      io.sockets.sockets.forEach((socket) => {
        if (String((socket as any).userId) !== excludeId) {
          socket.emit("newNotification", notif);
        }
      });
      break;

    case "admin":
      emitToRoom("admin");
      break;

    case "user":
      emitToRoom("user");
      break;

    default:
      // notif ciblée par userId
      if (notif.userId && notif.userId !== excludeId) {
        io.to(notif.userId).emit("newNotification", notif);
      }
      break;
  }
};

export { io };
