import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, RequestHandler } from "express";
import User from "../../models/user";

// ✅ étendre Request sans conflit avec Express
export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

// Middleware protect
export const protect: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest; // Caster req
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Pas de token, accès refusé" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    authReq.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err: any) {
    console.error("Erreur AuthMiddleware:", err.message);
    return res.status(401).json({
      message: err.name === "TokenExpiredError" ? "Token expiré" : "Token invalide",
    });
  }
};


// Vérifier si admin
export const admin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;
  if (user?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Accès refusé, administrateur requis" });
};
