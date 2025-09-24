import { useState, useEffect } from "react";
import { Plus, X, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence, } from "framer-motion";
import {
  getProductsByUser,
  addProduct,
  deleteProduct,
  updateProduct,
  ProductType,
} from "../services/productServices";
import { getCurrentUser } from "../utils/auth";
import { UserType } from "../utils/types";
import axios from "axios";

interface MyProductsProps {
  initialProducts?: ProductType[];
}

function getAxiosErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Erreur inconnue";
}

function withSafeAuthor(p: ProductType, me: UserType | null): ProductType {
  if (p.author && p.author.name) return p;
  return {
    ...p,
    author: me
      ? { _id: me._id, name: me.name }
      : { _id: "", name: "Utilisateur inconnu" },
  };
}

export default function MyProducts({ initialProducts = [] }: MyProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const currentUser: UserType | null = getCurrentUser();

  // Charger mes produits
  useEffect(() => {
    if (!currentUser) return;

    const fetchMyProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByUser(currentUser._id);
        setProducts(data.map((p) => withSafeAuthor(p, currentUser)));
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [currentUser?._id]);
// Ajouter un produit
const handleAddProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentUser || !imageFile) return;

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description || "");
    formData.append("image", imageFile);
    formData.append("user", currentUser._id);
    formData.append("status", "approuvé");

    const added: ProductType = await addProduct(formData);

    const addedWithAuthor: ProductType = {
      ...added,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        phone: currentUser.phone || "",
      },
      image: added.image || "",
    };

    console.log("🟢 Produit ajouté (frontend) :", addedWithAuthor);

    setProducts((prev) => [...prev, addedWithAuthor]);

    // Reset form
    setModalOpen(false);
    setName("");
    setPrice(0);
    setDescription("");
    setImageFile(null);

    alert("✅ Votre produit a été ajouté avec succès !");
  } catch (err: unknown) {
    console.error(err);
    alert(`❌ Erreur : impossible d'ajouter le produit. ${getAxiosErrorMessage(err)}`);
  } finally {
    setIsSubmitting(false);
  }
};


  // Supprimer un produit
  const handleDeleteProduct = async (id: string) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    try {
      await deleteProduct(id);

      // mise à jour front immédiate
      setProducts((prev) => prev.filter((p) => p._id !== id));

      alert("✅ Produit supprimé définitivement.");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("❌ Impossible de supprimer le produit.");
    }
  }
};

  // Mettre à jour un produit
const handleUpdateProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingProduct || !currentUser) return;

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("user", currentUser._id);

    // ⚡ Important : on force le status à "en_attente"
    formData.append("status", "en_attente");

    if (imageFile) formData.append("image", imageFile);

    const updated: ProductType = await updateProduct(editingProduct._id!, formData);

    const updatedWithAuthor: ProductType = {
      ...updated,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        phone: currentUser.phone || "",
      },
      image: updated.image || "",
    };

    console.log("🟢 Produit mis à jour (frontend) :", updatedWithAuthor);

    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? updatedWithAuthor : p))
    );

    setEditModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);

    alert("✅ Votre produit a été mis à jour");
  } catch (err: unknown) {
    console.error("Erreur lors de la mise à jour du produit :", err);
    alert(`❌ Impossible de mettre à jour le produit : ${getAxiosErrorMessage(err)}`);
  } finally {
    setIsSubmitting(false);
  }
};


 return (
  <div className="p-6">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-700">Mes Produits</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-shadow shadow-md"
      >
        <Plus className="w-4 h-4" /> Ajouter un produit
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : products.length === 0 ? (
      <p className="text-gray-500 text-center mt-8">
        Vous n'avez aucun produit pour l'instant.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow relative flex flex-col"
          >
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h2 className="font-semibold text-gray-700 text-lg">{p.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{p.description}</p>
            <p className="text-blue-600 font-bold mb-2">{p.price} FCFA</p>

            {/* 🔹 Boutons modernisés */}
            <div className="mt-auto flex gap-3 pt-3">
                {/* Modifier */}
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setName(p.name);
                    setPrice(p.price);
                    setDescription(p.description || "");
                    setImageFile(null);
                    setEditModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-2 py-2 bg-blue-100 hover:bg-blue-100 text-blue-600 font-medium rounded-lg shadow-sm transition"
                >              
                  <Edit2 size={18} />
                  Modifier
                </button>

                {/* Supprimer */}
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  className="flex items-center gap-2 px-2 py-2 bg-red-100 hover:bg-red-100 text-red-600 font-medium rounded-lg shadow-sm transition"
                >              
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>


          </div>
        ))}
      </div>
    )}

    {/* 🔹 Modal Ajouter */}
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Ajouter un produit
            </h2>
            <form className="flex flex-col gap-3" onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Nom du produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Prix"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-2 disabled:opacity-60"
              >
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* 🔹 Modal Modifier */}
    <AnimatePresence>
      {editModalOpen && editingProduct && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Modifier le produit
            </h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleUpdateProduct}
            >
              <input
                type="text"
                placeholder="Nom du produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Prix"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-2 disabled:opacity-60"
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

}
