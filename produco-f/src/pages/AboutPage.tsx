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
    const users = await getUsers();        // tableau de users
    const products = await getAllProducts(); // tableau de produits

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
      icon: <Users size={32} className="text-blue-500" />,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      label: "Produits ajoutés",
      value: productCount,
      icon: <Package size={32} className="text-green-500" />,
      gradient: "from-green-400 to-green-600",
    },
    {
      label: "Taux d’activité",
      value: activityRate + "%",
      icon: <Activity size={32} className="text-purple-500" />,
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        📊 Tendances de l’application
      </h2>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Desktop tableau */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-md border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date d’inscription</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cartes */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {userHistory.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <p className="font-semibold text-gray-700 break-words break-all truncate">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
