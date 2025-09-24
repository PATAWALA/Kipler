import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;       
  type: "payment" | "sale";
  amount: number;
  date: Date;
}

const transactionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["payment", "sale"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
