import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Clock, Layers, PlusCircle } from "lucide-react";
import { useState } from "react";
import { UserType } from "../utils/types";
import { ProductType, addProduct } from "../services/productServices";
import { getAxiosErrorMessage } from "../hooks/getAxiox";

type OutletContextType = {
  products: ProductType[];
  currentUser: UserType | null;
};

export default function UserDashboard() {
    const { products: allProducts, currentUser } = useOutletContext<OutletContextType>();
  const location = useLocation();
  const [products, setProducts] = useState<ProductType[]>(allProducts || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⚡️ Met à jour products si allProducts change
  useEffect(() => {
    setProducts(allProducts);
  }, [allProducts]);

  if (!currentUser) return <p className="text-red-500 p-6">Utilisateur non connecté.</p>;

  // Onglet actif depuis l’URL
  const pathTab = location.pathname.split("/").pop();
  const activeTab =
    !pathTab || pathTab === "user-dashboard"
      ? "dashboard"
      : (pathTab as "dashboard" | "products" | "market");

  // Stats dynamiques
  const publier = products.length;
  const attente = 0;
  const total = products.length;

  const cards = [
    {
      label: "Produits publiés",
      value: publier,
      icon: (
        <CheckCircle size={28} className="text-green-100 drop-shadow-sm" />
      ),
      gradient: "from-green-500 to-green-700",
    },
    {
      label: "En attente",
      value: attente,
      icon: <Clock size={28} className="text-yellow-100 drop-shadow-sm" />,
      gradient: "from-yellow-500 to-yellow-700",
    },
    {
      label: "Total",
      value: total,
      icon: <Layers size={28} className="text-blue-100 drop-shadow-sm" />,
      gradient: "from-blue-500 to-blue-700",
    },
  ];

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
      alert(
        `❌ Erreur : impossible d'ajouter le produit. ${getAxiosErrorMessage(
          err
        )}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header avec salutation */}
      <div className="bg-blue-600 text-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          👋 Bienvenue, {currentUser.name}
        </h1>
        <p className="text-blue-100 mt-2 md:mt-0">
          Voici un aperçu de vos produits et activités.
        </p>
      </div>

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
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 25px rgba(0,0,0,0.2)",
              }}
              className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all`}
            >
              {card.icon}
              <p className="mt-2 text-lg font-medium">{card.label}</p>
              <p className="mt-1 text-3xl md:text-4xl font-bold">
                {card.value}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bouton ajouter produit */}
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <p className="text-gray-700 mb-4">
          Vous pouvez ajouter un nouveau produit sur le marché en cliquant sur
          le bouton ci-dessous :
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 mx-auto font-semibold"
        >
          <PlusCircle size={20} /> Ajouter un produit
        </motion.button>
      </div>

      {/* Contenu selon onglet */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-6">
              📦 Historique de vos produits
            </h2>

            {products.length === 0 ? (
              <p className="text-gray-500">
                Vous n’avez publié aucun produit.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, index) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-gray-50 p-5 rounded-xl shadow flex flex-col gap-3 border hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>
                      <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs">
                        Approuvé
                      </span>
                    </div>
                    <p className="text-gray-700">Prix : {p.price} €</p>
                    <p className="text-gray-500 text-sm">
                      Publié le :{" "}
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Likes : {p.likes.length}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal formulaire ajouter produit */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
  onSubmit={handleAddProduct}
  className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
>
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Ajouter un produit
  </h2>

  {/* Nom du produit */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Nom du produit
    </label>
    <input
      type="text"
      placeholder="Ex : Ordinateur portable"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      required
    />
  </div>

  {/* Prix */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Prix (€)
    </label>
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      placeholder="Ex : 2000"
      value={price || ""}
      onChange={(e) => setPrice(Number(e.target.value))}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      required
    />
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Description
    </label>
    <textarea
      placeholder="Décrivez le produit..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  {/* Image */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Image du produit
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setImageFile(e.target.files ? e.target.files[0] : null)
      }
      className="w-full text-gray-700"
      required
    />
  </div>

  {/* Boutons */}
  <div className="flex justify-end gap-3 mt-4">
    <button
      type="button"
      onClick={() => setModalOpen(false)}
      className="px-4 py-2 rounded-lg border text-gray-600"
    >
      Annuler
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
    >
      {isSubmitting ? "Ajout..." : "Ajouter"}
    </button>
  </div>
</motion.form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
