import { useEffect, useState } from "react";
import { Trophy, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts, ProductType } from "../services/productServices";
import { getSellerOrders, OrderType } from "../services/OrderServices";
import { getCurrentUser } from "../utils/auth";
import { UserType } from "../utils/types";

export default function MesGains() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser() as UserType | null;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        const allProducts = await getAllProducts();
        const myProducts = allProducts.filter(
          (p) => p.author?._id === currentUser._id && p.status === "approuvé"
        );
        setProducts(myProducts);

        const myOrders = await getSellerOrders();
        setOrders(myOrders);
      } catch (err) {
        console.error("Erreur MesGains:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (!currentUser) return <p className="text-center mt-6">Connectez-vous pour voir vos gains.</p>;
  if (loading) return <p className="text-center mt-6">Chargement...</p>;

  // Statistiques
  const totalVues = products.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalCommandes = orders.length;

  const summaryCards = [
    {
      label: "Commandes validées",
      value: totalCommandes,
      icon: <ShoppingCart className="text-blue-500" size={28} />,
    },
    {
      label: "Nombre de vues",
      value: totalVues,
      icon: <Eye className="text-yellow-500" size={28} />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Mes Gains
      </h2>

      {/* Cartes résumés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AnimatePresence>
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:scale-105 transform transition"
            >
              {card.icon}
              <p className="text-gray-600 text-sm mt-2">{card.label}</p>
              <h3 className="text-xl font-bold text-gray-800 mt-1">{card.value}</h3>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Historique commandes */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Historique des commandes</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">Aucune commande enregistrée.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Produit</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Prix</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Acheteur</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="px-4 py-2 text-sm text-gray-700">{o.product.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{o.product.price.toLocaleString()} FCFA</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{o.buyer?.name || o.guestInfo?.name || "Invité"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
