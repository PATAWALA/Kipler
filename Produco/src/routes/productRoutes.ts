// routes/productRoutes.ts
import express from "express";
import {
  getProducts,
  getProductsByUser,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  adminApproveProduct,
  adminBlockProduct,
  publishProduct,
  likeProduct,
  unlikeProduct,
  viewProduct,   // ✅ nouvelle fonction contrôleur
} from "../controllers/productController";
import { protect, admin } from "../utils/middleware/authMiddleware";
import upload from "../utils/middleware/uploadsMiddleware";
import { RequestHandler } from "express";

const router = express.Router();

/**
 * ✅ ROUTES PUBLIQUES
 */
// Récupérer tous les produits
router.get("/", getProducts);

// Récupérer un produit par son ID
router.get("/:id", getProductById);

// ➕ Incrémenter les vues (publique, pas besoin d’être connecté)
router.post("/:id/view", viewProduct);

/**
 * ✅ ROUTES PROTÉGÉES
 */
// Récupérer les produits d’un utilisateur connecté
router.get("/user/:userId", protect, getProductsByUser);

// Ajouter un produit (upload image requis)
router.post("/", protect, upload.single("image"), createProduct);

// Modifier un produit (nouvelle image optionnelle)
router.put("/:id", protect, upload.single("image"), updateProduct);

// Supprimer un produit par user et tous les produits par admin
router.delete("/admin/:id", protect, admin, deleteProduct);
router.delete("/:id", protect, deleteProduct);

// Publier un produit mis à jour
router.put("/products/:id/publish", protect, publishProduct);

// Route spéciale admin pour bloquer un produit
router.delete("/:id/admin", protect, admin, adminBlockProduct);
router.put("/:id/admin/approve", protect, admin, adminApproveProduct);

// 🔒 routes protégées par auth
router.put("/:id/like", protect, likeProduct as RequestHandler);
router.put("/:id/unlike", protect, unlikeProduct as RequestHandler);

// Exemple de route test protégée
router.get("/protected/test", protect, (req, res) => {
  res.json({ message: "Tu es connecté et tu as accès à cette route ! 🎉" });
});

export default router;
