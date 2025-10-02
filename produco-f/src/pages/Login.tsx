import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, AuthUser } from "../services/authServices";
import { Eye, EyeOff } from "lucide-react";
import { saveCurrentUser, saveToken } from "../utils/auth";
import axios from "axios";
import Logo from "../assets/logo.png";
import PromoCarousel from "../components/ui/PromoCarousel";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

export default function Login({ setUser }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user: AuthUser & { token?: string } = await loginUser(email, password);
      saveCurrentUser(user);
      if (user.token) saveToken(user.token);
      setUser(user);
      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/user-dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "Erreur lors de la connexion");
      else if (err instanceof Error) setError(err.message);
      else setError("Erreur inconnue");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      
      {/* HEADER LOGO + DESCRIPTION */}
      <header className="flex flex-col items-center justify-center py-8 px-4 md:py-12 md:px-16">
        <img src={Logo} alt="Logo Kipler" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shadow-md mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          Bienvenue sur <span className="text-purple-600">Kipler</span> 🎉
        </h1>
        <p className="text-gray-600 text-center mt-2 max-w-2xl">
          Découvrez notre plateforme e-commerce, achetez les produits tendance et vendez facilement vos articles de luxe.
        </p>
      </header>

      {/* CARROUSEL PROMO */}
      <section className="w-full flex justify-center">
        <PromoCarousel />
      </section>

      {/* CTA BUTTONS */}
      <section className="flex flex-wrap justify-center gap-6 mt-6 px-4">
        <button
          onClick={() => navigate("/market")}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-700 transition"
        >
          Commander directement
        </button>
        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full shadow-md hover:bg-yellow-500 transition"
        >
          S'inscrire pour vendre
        </button>
      </section>

      {/* FORMULAIRE LOGIN */}
      <section className="flex justify-center mt-8 px-4 md:px-16 pb-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold text-center text-gray-600 mb-4">
            Connexion à votre compte
          </h2>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Se connecter
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Inscription
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
