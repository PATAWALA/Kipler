import { useState, useEffect } from "react";
import { Plus, X, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence, } from "framer-motion";
import {
  getProductsByUser,
  addProduct,
  deleteProduct,
  updateProduct,
  ProductType,
  getProductsByCategory
} from "../services/productServices";
import { getCurrentUser } from "../utils/auth";
import { UserType } from "../utils/types";
import { getAxiosErrorMessage } from "../hooks/getAxiox";
import { withSafeAuthor } from "../hooks/safeAuthor";

interface MyProductsProps {
  initialProducts?: ProductType[];
}

export default function MyProducts({ initialProducts = [] }: MyProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  // State des catégories prédéfinies
  const categories = ["Électronique", "Vêtements", "Maison", "Alimentation", "Services"];
  // Catégorie sélectionnée (pour filtrer l'affichage en haut)
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // Catégorie choisie dans le formulaire (ajout/édition produit)
  const [category, setCategory] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const currentUser: UserType | null = getCurrentUser();

  useEffect(() => {
  if (!currentUser) return;

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedCategory) {
        // 📌 Si une catégorie est sélectionnée → appelle le service getProductsByCategory
        data = await getProductsByCategory(selectedCategory);
      } else {
        // 📌 Sinon → charge tous les produits de l’utilisateur
        data = await getProductsByUser(currentUser._id);
      }

      setProducts(data.map((p) => withSafeAuthor(p, currentUser)));
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMyProducts();
}, [currentUser?._id, selectedCategory]); // 🔑 relance quand la catégorie change

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
    formData.append("category", category || "Général"); // ✅ nouvelle ligne

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

    setProducts((prev) => [...prev, addedWithAuthor]);

    // Reset form
    setModalOpen(false);
    setName("");
    setPrice(0);
    setDescription("");
    setImageFile(null);
    setCategory(""); // ✅ reset catégorie

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
    formData.append("status", "en_attente");
    if (imageFile) formData.append("image", imageFile);
    formData.append("category", category || "Général"); // ✅ ajout catégorie

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

    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? updatedWithAuthor : p))
    );

    setEditModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setCategory(""); // ✅ reset catégorie

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
   {/* 🔹 Header Mes Produits */}
   <motion.div
    className="flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm p-6 mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Titre + Texte */}
  <h1 className="text-2xl font-bold text-gray-800 mb-2">
    📦 Gestion de vos produits
  </h1>
  <p className="text-gray-500 max-w-md mb-6">
    Ajoutez, modifiez ou supprimez vos produits facilement.  
    Gardez votre catalogue toujours à jour.
  </p>

  {/* Bouton centré */}
  <motion.button
    onClick={() => setModalOpen(true)}
    className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Plus className="w-5 h-5" />
    <span className="font-semibold">Nouveau produit</span>
  </motion.button>
  </motion.div>

  {/* 🔹 Filtres Catégories */}
<div className="flex flex-wrap justify-center gap-3 mb-8">
  {categories.map((cat) => (
    <button
      key={cat}
      className={`px-4 py-2 rounded-lg border transition ${
        selectedCategory === cat
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setSelectedCategory(cat)}
    >
      {cat}
    </button>
  ))}
  <button
    className={`px-4 py-2 rounded-lg border transition ${
      selectedCategory === ""
        ? "bg-green-600 text-white border-green-600"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={() => setSelectedCategory("")}
  >
    Tous
  </button>
</div>


  {/* 🔹 Chargement */}
  {loading ? (
    <motion.div
      className="flex justify-center items-center h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </motion.div>
  ) : products.length === 0 ? (
    <motion.p
      className="text-gray-500 text-center mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Vous n’avez aucun produit pour l’instant. Ajoutez-en un pour commencer ✨
    </motion.p>
  ) : (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {products.map((p, i) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative flex flex-col"
        >
          <img
            src={p.image || "https://via.placeholder.com/150"}
            alt={p.name}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />
          <h2 className="font-semibold text-gray-700 text-lg">{p.name}</h2>
          <p className="text-gray-500 text-sm mb-2">{p.description}</p>
          <p className="text-blue-600 font-bold mb-2">{p.price} FCFA</p>

          {/* Boutons */}
          <div className="mt-auto flex gap-3 pt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setEditingProduct(p);
                setName(p.name);
                setPrice(p.price);
                setDescription(p.description || "");
                setCategory(p.category || "");
                setImageFile(null);
                setEditModalOpen(true);
              }}
              className="flex items-center gap-2 px-2 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg shadow-sm"
            >
              <Edit2 size={18} /> Modifier
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleDeleteProduct(p._id)}
              className="flex items-center gap-2 px-2 py-2 bg-red-100 text-red-600 font-medium rounded-lg shadow-sm"
            >
              <Trash2 size={18} /> Supprimer
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
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
        <motion.form
          onSubmit={handleAddProduct}
          className="bg-white rounded-2xl p-6 w-full max-w-md relative space-y-4 shadow-lg"
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

          <h2 className="text-xl font-bold text-gray-700">
            ➕ Ajouter un produit
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Remplissez les informations ci-dessous pour publier votre produit.
          </p>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom du produit
            </label>
            <input
              type="text"
              placeholder="Ex : Chaussures Nike"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix (FCFA)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ex : 2000"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Indiquez un prix clair et réaliste.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Ajoutez une courte description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisissez une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image du produit
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              required
              className="w-full text-sm text-gray-600"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </motion.button>
          </div>
        </motion.form>
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
        <motion.form
          onSubmit={handleUpdateProduct}
          className="bg-white rounded-2xl p-6 w-full max-w-md relative space-y-4 shadow-lg"
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

          <h2 className="text-xl font-bold text-gray-700">✏️ Modifier le produit</h2>
          <p className="text-sm text-gray-500 mb-2">
            Mettez à jour les champs nécessaires puis enregistrez vos changements.
          </p>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom du produit
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix (FCFA)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choisissez une catégorie --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nouvelle image (facultatif)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    )}
  </AnimatePresence>
</div>

);

}
