import mongoose, { Schema, Document, Types, Model } from "mongoose";

// Interface utilisateur peuplé
export interface IUserPopulated {
  _id: string;
  name: string;
  phone?: string;
}

// Interface produit "pure"
export interface IProduct {
  _id: Types.ObjectId;
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
  ordersCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type Document (Mongoose)
export type ProductDocument = IProduct & Document;

// Schéma produit
const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String, required: true },
    category: { type: String,  enum: [
    "Électronique",
    "Vêtements",
    "Maison",
    "Alimentation", 
    "Services",
    "others"
  ], required: true, default: "others" },
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

// ✅ Typage correct du modèle
const Product: Model<ProductDocument> = mongoose.model<ProductDocument>(
  "Product",
  ProductSchema
);

export default Product;
