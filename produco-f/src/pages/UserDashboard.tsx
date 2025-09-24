import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext, useLocation } from "react-router-dom";
import MyProducts from "./MyProducts";
import MesGains from "./MesGains";
import NousContacter from "../pages/NousContactez";
import { CheckCircle, Clock, Layers } from "lucide-react";
import { UserType } from "../utils/types";
import { ProductType } from "../services/productServices";

type OutletContextType = {
  products: ProductType[];
  currentUser: UserType | null;
};

export default function UserDashboard() {
  const { products: allProducts, currentUser } = useOutletContext<OutletContextType>();
  const location = useLocation();

  if (!currentUser)
    return <p className="text-red-500 p-6">Utilisateur non connecté.</p>;

  // Onglet actif déterminé depuis l'URL
  const pathTab = location.pathname.split("/").pop();
  const activeTab =
    !pathTab || pathTab === "user-dashboard" ? "dashboard" : (pathTab as "dashboard" | "products" | "settings" | "gains" | "contact");

  // Résumé des produits
  const publier = allProducts.length;
  const attente = 0;
  const total = allProducts.length;

  const cards = [
    { label: "Produits publiés", value: publier, icon: <CheckCircle size={28} className="text-green-300" />, gradient: "from-green-400 to-green-600" },
    { label: "En attente", value: attente, icon: <Clock size={28} className="text-yellow-300" />, gradient: "from-yellow-400 to-yellow-600" },
    { label: "Total", value: total, icon: <Layers size={28} className="text-blue-300" />, gradient: "from-blue-400 to-blue-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        Bienvenue <span className="text-indigo-600">{currentUser.name}</span>
      </h1>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 25px rgba(0,0,0,0.2)" }}
              className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all`}
            >
              {card.icon}
              <p className="mt-2 text-lg font-medium">{card.label}</p>
              <p className="mt-1 text-3xl md:text-4xl font-bold">{card.value}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Contenu selon onglet */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Historique des produits</h2>

            {allProducts.length === 0 ? (
              <p className="text-gray-500">Vous n’avez publié aucun produit.</p>
            ) : (
              <>
                {/* Desktop / Tablette */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Nom</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Prix</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Likes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allProducts.map((p) => (
                        <tr key={p._id}>
                          <td className="px-4 py-2 text-sm text-gray-700">{p.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{p.price} €</td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs">Approuvé</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{p.likes.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex flex-col gap-4">
                  {allProducts.map((p) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-gray-50 p-4 rounded-xl shadow flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                        <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs">Approuvé</span>
                      </div>
                      <p className="text-gray-700">Prix : {p.price} €</p>
                      <p className="text-gray-500 text-sm">Publié le : {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</p>
                      <p className="text-gray-700 text-sm">Likes : {p.likes.length}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "products" && (
          <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <MyProducts initialProducts={allProducts} />
          </motion.div>
        )}

        {activeTab === "gains" && (
          <motion.div key="gains" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <MesGains products={allProducts} />
          </motion.div>
        )}

        {activeTab === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <NousContacter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
