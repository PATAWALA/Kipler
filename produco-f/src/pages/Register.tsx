import { useState } from "react";
import { registerUser, AuthUser } from "../services/authServices";
import { saveCurrentUser, saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShoppingBag, UserPlus } from "lucide-react";
import axios from "axios";
import Logo from "../assets/logo.png";

// Images produits
import watch1 from "../assets/register/watch1.jpg";
import clothes1 from "../assets/register/clothes1.jpg";
import sneakers1 from "../assets/register/sneakers1.jpg";
import accessory1 from "../assets/register/accessory1.jpg";

interface RegisterProps {
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

export default function Register({ setUser }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const newUser: AuthUser & { token?: string } = await registerUser({
        name,
        email,
        phone,
        password,
        role: "user",
      });

      saveCurrentUser(newUser);
      if (newUser.token) saveToken(newUser.token);
      setUser(newUser);

      navigate("/user-dashboard"); // redirection après inscription
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      else if (err instanceof Error) setError(err.message);
      else setError("Erreur inconnue");
    }
  };

  
  const products = [
    { id: 1, name: "Botte élégant", image: watch1 },
    { id: 2, name: "Des Rollers ", image: clothes1 },
    { id: 3, name: "Des Pulls", image: sneakers1 },
    { id: 4, name: "Botte confortable", image: accessory1 },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* HEADER */}
      <header className="flex items-center px-6 py-4">
        <img src={Logo} alt="Logo Produco" className="w-14 h-14 object-cover rounded-xl shadow-md" />
        <h1 className="ml-3 text-2xl font-extrabold text-gray-800">Kipler</h1>
      </header>

      {/* HERO / Produits populaires */}
      <section className="px-6 py-8 md:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Découvrez les produits que vous allez adorer 🎉
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
              <div className="p-2 text-center">
                <h4 className="text-sm font-semibold">{p.name}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons choix utilisateur */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => navigate("/market")}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            <ShoppingBag size={18} />
            Acheter directement
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            <UserPlus size={18} />
            S'inscrire pour vendre & acheter
          </button>
        </div>
      </section>

      {/* FORMULAIRE D'INSCRIPTION */}
      <section className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto mb-12">
        <h2 className="text-lg font-semibold text-center text-gray-600 mb-4">
          Créer un compte
        </h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Téléphone"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-purple-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Avez-vous déjà un compte ?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Me connecter 
          </span>
        </p>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center bg-gray-100 mt-auto">
        <p className="text-gray-600 text-sm">
          © 2025 Produco — Achetez et vendez en toute simplicité 🚀
        </p>
      </footer>
    </div>
  );
}
