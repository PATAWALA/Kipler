import { useEffect, useState } from "react";
import { Trophy, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts, ProductType } from "../services/productServices";
import { getSellerOrders, OrderType } from "../services/OrderServices";
import { getCurrentUser } from "../utils/auth";
import { UserType } from "../utils/types";

type MesGainsProps = {
  products?: ProductType[]; // ✅ facultatif
};

export default function MesGains({ products: initialProducts }: MesGainsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts || []);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(!initialProducts); // si on a déjà des produits => pas de loading
  const currentUser = getCurrentUser() as UserType | null;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || initialProducts) return; // si props déjà fourni => pas de fetch
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
  }, [currentUser, initialProducts]);

  if (!currentUser) {
    return <p className="text-center mt-6">Connectez-vous pour voir vos gains.</p>;
  }
  if (loading) {
    return <p className="text-center mt-6">Chargement...</p>;
  }

  // Statistiques
  const totalVues = products.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalCommandes = orders.length;

  const summaryCards = [
    {
      label: "Commandes validées",
      value: totalCommandes,
      icon: <ShoppingCart className="text-white" size={28} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Nombre de vues",
      value: totalVues,
      icon: <Eye className="text-white" size={28} />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
        <Trophy className="text-yellow-500" /> Mes Gains
      </h2>

      {/* Cartes résumés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-gradient-to-r ${card.gradient} rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transform transition`}
            >
              <div className="p-3 bg-white/20 rounded-full mb-3">{card.icon}</div>
              <h3 className="text-2xl font-extrabold text-white">{card.value}</h3>
              <p className="text-white/90 text-sm mt-1">{card.label}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Historique commandes en cards */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Historique des commandes
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">Aucune commande enregistrée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((o, index) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {o.product.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  Prix :{" "}
                  <span className="font-medium text-gray-900">
                    {o.product.price.toLocaleString()} FCFA
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Acheteur :{" "}
                  <span className="font-medium text-gray-900">
                    {o.buyer?.name || o.guestInfo?.name || "Invité"}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
