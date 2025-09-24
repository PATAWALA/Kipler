import mongoose, { Schema, Document, Types } from "mongoose";

// Interface produit
export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  stock: string; 
  tags?: string[];
  sku?: string;
  user: Types.ObjectId | IUserPopulated;
  status: "en_attente" | "approuvé" | "supprimé";
  likes: (Types.ObjectId | IUserPopulated)[];
  guestLikes: string[];
  views: number;
  ordersCount?: number; // compteur de commandes
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface utilisateur peuplé
export interface IUserPopulated {
  _id: string;
  name: string;
  phone?: string;
}

// Schéma produit
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String, required: true },
    category: { type: String, required: true, default: "Général" }, // défaut pour éviter l'erreur
    stock: { type: String, default: "Disponible" },
    tags: { type: [String], default: [] },
    sku: { type: String },

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["en_attente", "approuvé", "supprimé"],
      default: "approuvé",
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    guestLikes: {
      type: [String],
      default: [],
    },

    views: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
