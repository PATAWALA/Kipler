import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Interface pour typer l'utilisateur
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
  phone?: string;
  status : "blocked"|"active"|"supprimer" ; 
  createdAt?: string;
  photo?: string;
}

// Schéma Mongoose
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, 
    phone: { type: String, required: false }
  },
  {
    timestamps: true,
  }
);

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

// Méthode pour comparer le mot de passe entré
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;                      
