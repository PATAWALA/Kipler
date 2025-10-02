// controllers/productController.ts
import { Request, Response, RequestHandler } from "express";
import Product, { IUserPopulated } from "../models/produit";
import { Types } from "mongoose";
import { AuthRequest } from "../utils/middleware/authMiddleware";
import { createNotification } from "../controllers/notificationsControllers";
import { formatProduct } from "../utils/productFormateur";
import Notification, { INotification } from "../models/notifications";
import { emitNotification } from "../socket";



interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: any; // injecté par middleware protect   
}

export const createProduct = async (req: MulterRequest, res: Response) => { 
  try {
    if (!req.user) return res.status(401).json({ message: "Non autorisé 🚫" });

    const { name, price, description, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Nom, prix et catégorie sont requis." });
    }

    // ✅ Création du produit
    const newProduct = new Product({
      name,
      price,
      description,
      category: category || "Others",
      stock: stock || "Disponible",
      image: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null,
      user: req.user._id,
      status: "approuvé",
    });

    await newProduct.save();
    await newProduct.populate("user", "_id name phone");
    await newProduct.populate("likes", "_id name phone");

    console.log("PRODUCT ID:", newProduct._id);

    // 🔔 Création de la notification globale (tout le monde sauf l’auteur)
    const notif = new Notification({
      type: "new_product",
      message: `Nouveau produit ajouté : ${newProduct.name}`,
      link: `/market/${newProduct._id}`,
      isRead: false,
      targetRole: "all",
      product: newProduct._id.toString(),  
    });

    await notif.save();

    // ⚡ Émission via WebSocket (exclure l’auteur)
    emitNotification("all", notif, { excludeUserId: req.user._id.toString() });

    res.status(201).json({
      message: "Produit publié avec succès ✅",
      product: formatProduct(newProduct),
    });
  } catch (err) {
    console.error("Erreur createProduct:", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

export const publishProduct = async (req: MulterRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone");

    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    const isOwner = (product.user as any)?._id.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Accès refusé 🚫" });

    const { name, price, description, category, stock } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (req.file) {
      product.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    product.status = "approuvé";
    await product.save();
    await product.populate("user", "_id name phone");
    await product.populate("likes", "_id name phone");

    // 🔔 Notif pour le propriétaire
    if (product.user) {
      await createNotification(
        "approve",
        `Votre produit "${product.name}" est publié ✅`,
        {
          userId: (product.user as any)._id.toString(),
          productId: product._id.toString(),
          link: `/products/${product._id.toString()}`,
        }
      );
    }

    // 🔔 Notif pour tous les utilisateurs
    await createNotification(
      "new_product",
      `🆕 Nouveau produit disponible : "${product.name}" !`,
      {
        targetRole: "all",
        productId: product._id.toString(),
        link: `/products/${product._id.toString()}`,
      }
    );

    res.json({
      message: "✅ Produit publié avec succès",
      product: formatProduct(product),
    });
  } catch (err) {
    console.error("Erreur publication:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- ⚡ Récupérer produits par catégorie
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, status: "approuvé" })
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone")
      .sort({ createdAt: -1 });

    res.json(products.map(formatProduct));
  } catch (err) {
    console.error("Erreur getProductsByCategory:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


//Sppression des produits par admin et users .
export const deleteProduct: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    const userId = authReq.user?._id.toString();
    const isOwner =
      product.user?.toString() === userId ||
      (typeof product.user === "object" && " _id" in product.user && product.user._id.toString() === userId);

    const isAdmin = authReq.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Accès refusé 🚫" });
    }

    await product.deleteOne();
    return res.json({ message: "Produit supprimé définitivement ✅" });
  } catch (error: any) {
    console.error("Erreur suppression produit :", error.message, error.stack);
    return res.status(500).json({ message: error.message });
  }
};

// 📋 Tous les produits
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone")
      .lean();

    const productsWithAuthor = products.map(formatProduct);
    res.json(productsWithAuthor);
  } catch (err) {
    console.error("❌ Erreur getProducts :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Récupérer un produit par son ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone");

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé ❌" });
    }

    res.json(formatProduct(product));
  } catch (err) {
    console.error("❌ Erreur getProductById :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// 🔹 Produits d’un utilisateur
export const getProductsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const products = await Product.find({ user: userId })
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone")
      .lean();

    const productsWithAuthor = products.map((p: any) => {
      const author = p.user as IUserPopulated | null;
      const likes = (p.likes as IUserPopulated[]) || [];

      return {
        ...p,
        author: author
          ? { _id: author._id, name: author.name, phone: author.phone || "" }
          : { _id: "", name: "Utilisateur inconnu", phone: "" },
        likes,
        phone: author?.phone || "",
        user: author?._id || null,
      };
    });

    res.json(productsWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✏️ Modifier un produit
export const updateProduct = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Non autorisé 🚫" });

    const { id } = req.params;
    const { name, price, description, category, stock } = req.body;

    const product = await Product.findById(id).populate("user", "_id name phone");
    if (!product) return res.status(404).json({ message: "Produit introuvable ❌" });

    // Vérifier que le produit appartient bien à l’utilisateur
    if (product.user && product.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Action non autorisée 🚫" });
    }

    // Mise à jour des champs
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    if (req.file) {
      product.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await product.save();
    await product.populate("user", "_id name phone");

    res.json({
      message: "Produit mis à jour avec succès ✅",
      product: {
        ...product.toObject(),
        author: {
          _id: (product.user as any)?._id,
          name: (product.user as any)?.name,
          phone: (product.user as any)?.phone || "",
        },
      },
    });
  } catch (err) {
    console.error("❌ Erreur updateProduct :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 🛑 Bloquer / supprimer un produit en tant qu’admin
export const adminBlockProduct = async (req: MulterRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("user", "_id name");
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // ⚡ L'admin modifie seulement le statut
    product.status = "supprimé";
    await product.save();

    // 🔔 Notifier le propriétaire
    if (product.user) {
      await createNotification(
        "block",
        `🚫 Votre produit "${product.name}" a été bloqué par l’administrateur.`,
        {
          userId: (product.user as any)._id.toString(),
          productId: product._id.toString(),
          link: `/products/${product._id.toString()}`,
        }
      );
    }

    res.json({
      message: "Produit bloqué par l’administrateur 🚫",
      product: {
        ...product.toObject(),
        author: product.user
          ? { _id: (product.user as any)._id.toString(), name: (product.user as any).name }
          : null,
      },
    });
  } catch (error) {
    console.error("Erreur adminBlockProduct:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const adminApproveProduct = async (req: MulterRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("user", "_id name");
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    product.status = "approuvé"; // validation admin
    await product.save();

    // 🔔 Notif pour le propriétaire
    if (product.user) {
      await createNotification(
        "approve",
        `Bonne nouvelle 🎉 ! Votre produit "${product.name}" est maintenant approuvé et disponible.`,
        {
          userId: (product.user as any)._id.toString(),
          productId: product._id.toString(),
          link: `/products/${product._id.toString()}`,
        }
      );
    }

    // 🔔 Notif pour tous les utilisateurs (sauf le propriétaire)
    await createNotification(
      "new_product",
      `🆕 Nouveau produit disponible : "${product.name}" !`,
      {
        targetRole: "all",
        productId: product._id.toString(),
        link: `/products/${product._id.toString()}`,
      }
    );

    res.json({
      message: "Produit approuvé ✅",
      product: {
        ...product.toObject(),
        author: product.user
          ? { _id: (product.user as any)._id, name: (product.user as any).name }
          : null,
      },
    });
  } catch (error) {
    console.error("Erreur adminApproveProduct:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- ⚡ Ajouter un like (pour user connecté ou invité) 
export const likeProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone");

    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    if (req.user?._id) {
      // ✅ User connecté
      const userId = req.user._id.toString();

      // Vérifier si déjà liké
      const alreadyLiked = product.likes.some((like) => {
        if (like instanceof Types.ObjectId) return like.toString() === userId;
        if (typeof like === "string") return like === userId;
        return like._id.toString() === userId;
      });

      if (!alreadyLiked) {
        product.likes.push(new Types.ObjectId(userId));

        // 🔔 Notification pour le propriétaire
        if (product.user && product.user._id.toString() !== userId) {
          await createNotification(
      "like",
      `❤️ ${req.user.name} a aimé votre produit "${product.name}"`,
  {    
        userId: product.user._id.toString(), // destinataire
        targetRole: undefined, // ou ne pas le définir
        data: { likerId: userId, productId: product._id.toString() },
        link: `/products/${product._id}`,
        excludeUserId: userId, // exclure l’auteur du like si connecté
      }
    );
        }
      }
    } else {
      // 👤 Invité
      const guestId = `guest_${req.ip}`;
      if (!product.guestLikes.includes(guestId)) {
        product.guestLikes.push(guestId);
      }
    }

    await product.save();
    res.json(product);

  } catch (error) {
    console.error("Erreur likeProduct:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- ⚡ Retirer un like (pour user connecté ou invité)
export const unlikeProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    if (req.user?._id) {
      // ✅ User connecté
      const userId = req.user._id.toString();
      product.likes = product.likes.filter((like) =>
        like instanceof Types.ObjectId ? !like.equals(userId) : like._id?.toString() !== userId
      );
    } else {
      // 👤 Invité
      const guestId = `guest_${req.ip}`;
      product.guestLikes = product.guestLikes.filter((id) => id !== guestId);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Erreur unlikeProduct:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Incrémenter les vues d’un produit
export const viewProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // incrémente de +1
      { new: true }
    )
      .populate("user", "_id name phone")
      .populate("likes", "_id name phone");

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json({
      ...product.toObject(),
      author: product.user
        ? { _id: (product.user as any)._id.toString(), name: (product.user as any).name }
        : null,
    });
  } catch (error: any) {
    console.error("❌ Erreur lors de l’incrémentation des vues :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
