// server.ts
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http"; 
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionsRoutes";
import notificationRoutes from "./routes/notificationsRoutes"; 
import { initSocket } from "./socket";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// 📂 Images publiques
app.use("/uploads", express.static(path.resolve("uploads")));

// Routes API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ ajout

// ✅ Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas !");

    // 🔥 Initialiser Socket.IO
    initSocket(server);

    // 🚀 Lancer serveur
    server.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur connexion MongoDB:", err.message);
  });
