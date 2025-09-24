import mongoose from "mongoose";
import User from "./src/models/user"; 

const MONGO_URI = "mongodb+srv://produco-user:Patawala%402003@cluster0.q6gyyrs.mongodb.net/produco_db?retryWrites=true&w=majority&appName=Cluster0";

async function fixAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "adm@gmail.com";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ Aucun utilisateur trouvé avec l'email", email);
      return;
    }

    // Forcer le rôle admin
    user.role = "admin";
    await user.save();

    console.log("✅ Admin corrigé avec succès !");
    console.log(user);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
}

fixAdmin();
