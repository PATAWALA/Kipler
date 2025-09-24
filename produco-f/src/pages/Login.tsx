import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, AuthUser } from "../services/authServices";
import { Eye, EyeOff, ShoppingBag, UserPlus } from "lucide-react";
import { saveCurrentUser, saveToken } from "../utils/auth";
import axios from "axios";
import Logo from "../assets/logo.png";
import product1 from "../assets/login/headphones.jpg";
import product2 from "../assets/login/watch.jpg";
import product3 from "../assets/login/sneakers.jpg";

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
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la connexion");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
    }
  };

  const products = [
    { id: 1, name: "Des pulls pour vous", price: "45€", image: product1 },
    { id: 2, name: "Pour vos activitées sportives", price: "65€", image: product2 },
    { id: 3, name: "Pour vos cadeaux", price: "89€", image: product3 },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      
      {/* LEFT SECTION - PRODUITS / PUB */}
      <section className="flex-1 flex flex-col items-center justify-center py-10 px-6 md:px-12 bg-white md:rounded-r-3xl md:shadow-lg">
        <header className="flex items-center mb-8">
          <img src={Logo} alt="Logo Produco" className="w-14 h-14 object-cover rounded-xl shadow-md" />
          <h1 className="ml-3 text-2xl font-extrabold text-gray-800">Kipler</h1>
        </header>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
          Bienvenue sur <span className="text-purple-600">Kipler</span> 🎉
        </h2>
        <p className="text-gray-600 max-w-xl text-center mb-6">
          Découvrez notre plateforme e-commerce, achetez les produits tendance et vendez facilement vos articles de luxe.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button
            onClick={() => navigate("/market")}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            <ShoppingBag size={18} />
            Commander directement
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full shadow-md hover:bg-yellow-500 transition"
          >
            <UserPlus size={18} />
            Inscrivez-vous pour vendre
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Votre boutique en ligne</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate("/market")}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <p className="text-purple-600 font-bold">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT SECTION - FORMULAIRE LOGIN */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
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
