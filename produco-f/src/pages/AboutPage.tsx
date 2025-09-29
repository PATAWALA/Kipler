import { useEffect, useState } from "react";
import { getUsers } from "../services/authServices";
import { getAllProducts } from "../services/productServices";
import { Users, Package, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface UserHistory {
  id: string;
  email: string;
  createdAt: string;
}

export default function AboutPage() {
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [activityRate, setActivityRate] = useState<number>(0);
  const [userHistory, setUserHistory] = useState<UserHistory[]>([]);

  const fetchStats = async () => {
    try {
      const users = await getUsers();        
      const products = await getAllProducts(); 

      setUserCount(users.length);
      setProductCount(products.length);

      if (users.length > 0) {
        const rate = Math.min(100, Math.round((products.length / users.length) * 100));
        setActivityRate(rate);
      }

      const history: UserHistory[] = users.map((u) => ({
        id: u._id,
        email: u.email,
        createdAt: new Date(u.createdAt).toLocaleString(),
      }));

      setUserHistory(history);
    } catch (err) {
      console.error("Erreur récupération stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Utilisateurs inscrits",
      value: userCount,
      icon: <Users size={32} className="text-blue-100" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      label: "Produits ajoutés",
      value: productCount,
      icon: <Package size={32} className="text-green-100" />,
      gradient: "from-green-500 to-green-700",
    },
    {
      label: "Taux d’activité",
      value: activityRate + "%",
      icon: <Activity size={32} className="text-purple-100" />,
      gradient: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-blue-600 text-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">👋 Bienvenue sur l’espace Statistiques</h1>
        <p className="text-blue-100 mt-2">
          Voici un aperçu des tendances et de l’historique des utilisateurs.
        </p>
      </div>

      {/* Statistiques principales */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
        📊 Tendances de l’application
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-gradient-to-r ${stat.gradient} text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition cursor-pointer`}
          >
            <div className="mb-4">{stat.icon}</div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-white/80 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Historique utilisateurs */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🧑‍💻 Historique des utilisateurs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userHistory.map((user, index) => {
          const initial = user.email.charAt(0).toUpperCase();
          const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-orange-500"];
          const color = colors[index % colors.length];

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 border hover:shadow-lg transition"
            >
              {/* Avatar avec initiale */}
              <div className={`${color} text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow`}>
                {initial}
              </div>

              {/* Infos utilisateur */}
              <div>
                <p className="font-semibold text-gray-700 break-words">{user.email}</p>
                <p className="text-gray-500 text-sm">{user.createdAt}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
