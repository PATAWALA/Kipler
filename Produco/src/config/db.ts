import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ Connexion à MongoDB réussi!: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ connection à MongoBD échouer', error);
    process.exit(1); // Stoppe l'application en cas d'erreur
  }
};

export default connectDB;
