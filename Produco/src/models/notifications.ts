import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId?: string; // facultatif si notif globale (ex: "all")
  targetRole?: "admin" | "user" | "all";
  type:
    | "like"
    | "new_product"
    | "message"
    | "order_status"
    | "views"
    | "system"
    | "approve"
    | "block"
    | "new_user";
  message: string;
  data?: Record<string, any>; 
  isRead: boolean;
  product?: string;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: false }, // facultatif
  targetRole: {
    type: String,
    enum: ["admin", "user", "all"],
    default: "user",
  },
  type: {
    type: String,
    enum: [
      "like",
      "new_product",
      "message",
      "order_status",
      "views",
      "system",
      "block",
      "approve",
      "new_user",
    ],
    required: true,
  },
  message: { type: String, required: true },
  data: { type: Object, default: {} },
  isRead: { type: Boolean, default: false },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
  link: { type: String, default: "/user-dashboard/products" },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.post("findOneAndUpdate", async function(doc) {
  if (doc?.isRead) {
    await doc.deleteOne(); // supprime la notif lue
  }
});


export default mongoose.model<INotification>("Notification", NotificationSchema);
