import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { generateToken } from '../utils/generateToken';
import { createNotification } from "../controllers/notificationsControllers"; // ✅
import { emitNotification } from "../socket"; // ✅




// 👤 Inscription utilisateur
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Utilisateur déjà existant" });

    const role = email === "adm@gmail.com" ? "admin" : "user";
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // 🔔 Notif admin pour toute nouvelle inscription
    const allAdmins = await User.find({ role: "admin" });
    for (const admin of allAdmins) {
      await createNotification(
        "new_user",
        `🎉 Nouvel utilisateur inscrit : ${newUser.name}`,
        {
          userId: admin._id.toString(), // ✅ corrigé
          link: `/users/${newUser._id.toString()}`,
        }
      );
    }

    res.status(201).json({
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id.toString()),
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // ⚡ On récupère l'utilisateur depuis la DB
    const user = (await User.findOne({ email })) as (IUser & { _id: any }) | null;

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 🔒 Vérifie le status
    if (user.status === "blocked") {
      return res.status(403).json({
        message:
          "🚫 Votre compte a été bloqué car vous n'avez pas respecté les règles de l'application. Merci de créer un nouveau compte.",
      });
    }

    if (user.status === "supprimer") { // ⚡ Utiliser exactement la valeur de l'interface
      return res.status(403).json({
        message:
          "🚫 Ce compte a été supprimé par un administrateur car il ne respectait pas les règles. Merci de créer un nouveau compte.",
      });
    }

    // ✅ Vérifie le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // ⚡ Sécurité : attribuer le rôle si manquant
    let role = user.role;
    if (!role) {
      role = user.email === "adm@gmail.com" ? "admin" : "user";
      user.role = role;
      await user.save();
    }

    // ✅ Connexion réussie
    res.json({
      _id: user._id.toString(),
      name: (user as any).name,
      email: user.email,
      role,
      token: generateToken(user._id.toString()),
      status: user.status,
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// Avoir accès a tout les users .
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// ⚡ Bloquer un utilisateur (au lieu de le supprimer)
export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 🔒 On interdit de bloquer l’admin principal
    if (user.email === "adm@gmail.com") {
      return res.status(403).json({
        message: "Impossible de bloquer l'administrateur principal !",
      });
    }

    // ⚡ On bloque le compte
    user.status = "blocked";
    await user.save();

    res.json({
      message: `✅ Le compte de ${user.name} a été bloqué.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors du blocage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ⚡ Débloquer un utilisateur
export const unblockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.status = "active";
    await user.save();

    res.json({
      message: `✅ Le compte de ${user.name} a été réactivé.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors du déblocage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



