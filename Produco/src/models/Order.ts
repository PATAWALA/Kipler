import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  product: Types.ObjectId;
  seller: Types.ObjectId; // le vendeur (propriétaire du produit)
  buyer?: Types.ObjectId; // si utilisateur connecté
  guestInfo?: { name?: string; phone?: string }; // si invité
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User" }, // optionnel
    guestInfo: {
      name: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
