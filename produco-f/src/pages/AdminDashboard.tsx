
import { motion, AnimatePresence } from "framer-motion";
import { Users, PackagePlus } from "lucide-react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import AdminGestionP from "./AdminGestionP";
import { ProductType } from "../services/productServices";
import { AdminTab, UserType } from "../utils/types";

type OutletContextType = {
  products: ProductType[];
  currentUser: UserType | null;
};

export default function AdminDashboard() {
  const { currentUser } = useOutletContext<OutletContextType>();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser)
    return <p className="text-red-500 p-6">Utilisateur non connecté.</p>;

  // Onglet actif depuis l'URL
  const pathTab = location.pathname.split("/").pop() || "dashboard";
  const activeTab = pathTab as AdminTab;

  const cards = [
    { label: "Gestion des Produits", tab: "admingestion" as AdminTab, icon: <PackagePlus size={28} className="text-green-300" />, gradient: "from-green-400 to-green-600", description: "Voir et modifier les produits" },
    { label: "Publier un produit", tab: "publish" as AdminTab, icon: <PackagePlus size={28} className="text-yellow-300" />, gradient: "from-yellow-400 to-yellow-600", description: "Ajouter des produits visibles par tous" },
    { label: "Tous les produits", tab: "products" as AdminTab, icon: <PackagePlus size={28} className="text-blue-300" />, gradient: "from-blue-400 to-blue-600", description: "Voir tous les produits publiés" },
    { label: "Utilisateurs", tab: "users" as AdminTab, icon: <Users size={28} className="text-pink-300" />, gradient: "from-pink-400 to-pink-600", description: "Gérer les comptes utilisateurs" },

  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Tableau de bord <span className="text-indigo-600">Admin</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-2xl shadow-lg cursor-pointer flex flex-col justify-between hover:scale-105 transform transition ${activeTab === card.tab ? "ring-4 ring-indigo-500" : ""}`}
              onClick={() => navigate(`/admin-dashboard/${card.tab}`)}
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <h2 className="text-lg font-semibold">{card.label}</h2>
              </div>
              <p className="mt-3 text-sm text-white/80">{card.description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "admingestion" && <AdminGestionP />}
        {activeTab === "publish" && <div>Publier un produit</div>}
        {activeTab === "products" && <div>Tous les produits</div>}
        {activeTab === "users" && <div>Gestion utilisateurs</div>}
      </AnimatePresence>
    </div>
  );
}
