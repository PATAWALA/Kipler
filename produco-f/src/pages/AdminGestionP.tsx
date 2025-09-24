import { useEffect, useState } from "react";
import { deleteProductByAdmin, } from "../services/authServices";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts , ProductType,getAuthHeader} from "../services/productServices";

export default function AdminGestionP() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductType[] = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Supprimer un produit en tant qu’admin
const handleDeleteProduct = async (id: string) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    try {
      await deleteProductByAdmin(id);

      // Mise à jour instantanée côté front
      setProducts((prev) => prev.filter((p) => p._id !== id));

      alert("✅ Produit supprimé définitivement.");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      console.log("Headers envoyés :", getAuthHeader());
      alert("❌ Impossible de supprimer le produit.");
    }
  }
};

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
    
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📋 Gestion des produits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />

              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm mb-1">
                Publié par : {product.author?.name || "Utilisateur inconnu"}
              </p>
              <p className="text-green-600 font-bold mb-2">{product.price} FCFA</p>

              {product.status === "supprimé" && (
                <p className="text-red-600 font-semibold mb-2">
                  Ce produit a été supprimé car il ne respecte pas les règles
                </p>
              )}

              <div className="mt-auto flex gap-2">
                {product.status !== "supprimé" && (
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
