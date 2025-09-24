import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string; 
  type: "like" | "new_product" | "block" | "approve" | "new_product_alert" | "new_user"; 
  message: string; 
  data?: object; 
  isRead: boolean; 
  product?: string; 
  link?: string; // 👈 lien de redirection
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["like", "new_product", "block", "approve", "new_product_alert", "new_user"], 
    required: true 
  },
  message: { type: String, required: true },
  data: { type: Object, default: {} },
  isRead: { type: Boolean, default: false },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  link: { type: String, default: "/user-dashboard/products" }, // 👈 par défaut vers marché
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
