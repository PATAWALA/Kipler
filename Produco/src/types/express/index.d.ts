import { Socket as SocketIOSocket, Server as SocketIOServer } from "socket.io";

declare global {
  namespace Express {
    export interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      user?: {
        _id: string;      
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
      };
      io?: SocketIOServer; // ✅ io attaché directement à la requête
      socket?: SocketIOSocket; // optionnel si tu veux l’utiliser plus tard
    }
  }
}

export {};
