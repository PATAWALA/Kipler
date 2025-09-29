import { useEffect, useState } from "react";
import {
  getAllProducts,
  ProductType,
  likeProduct,
  unlikeProduct,
  viewProduct,
} from "../services/productServices";
import { getCurrentUser } from "../utils/auth";
import { UserType } from "../utils/types";
import { Heart, ShoppingCart, Search, Filter, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PRODUCT_STATUS = {
  APPROVED: "approuvé",
  PENDING: "en_attente",
  REJECTED: "rejeté",
  DELETED: "supprimé",
} as const;

export default function AllProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const currentUser = getCurrentUser() as UserType | null;
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Récupération de tous les produits
      const data: ProductType[] = await getAllProducts();
      console.log("📦 Produits récupérés :", data);

      // Filtrer uniquement les produits valides
      const filteredProducts = data.filter(
        (p) =>
          p.status !== PRODUCT_STATUS.DELETED &&
          p.status !== PRODUCT_STATUS.REJECTED
      );

      // Optionnel : mettre à jour les vues via viewProduct
      const productsWithViews = await Promise.all(
        filteredProducts.map(async (product) => {
          try {
            const updated = await viewProduct(product._id);
            return { ...product, views: updated.views ?? product.views };
          } catch {
            return product;
          }
        })
      );

      setProducts(productsWithViews);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des produits :", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  const handleLike = async (productId: string) => {
    if (!currentUser) return;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const userId = currentUser._id;
    const alreadyLiked = product.likes.includes(userId);

    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? {
              ...p,
              likes: alreadyLiked
                ? p.likes.filter((like) => like !== userId)
                : [...p.likes, userId],
            }
          : p
      )
    );


    try {
      if (alreadyLiked) await unlikeProduct(productId, userId);
      else await likeProduct(productId, userId);
    } catch (err) {
      console.error("❌ Erreur like/unlike :", err);
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? product : p))
      );
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const filteredAndSorted = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase().trim())
    )
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
      }
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800 text-center">
        🛍️ Produits disponibles sur le Marché
      </h1>

      {/* Recherche + tri */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="recent">🔄 Plus récents</option>
            <option value="price-asc">⬆️ Prix croissant</option>
            <option value="price-desc">⬇️ Prix décroissant</option>
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
          </select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-gray-500 text-center">
          Aucun produit ne correspond à votre recherche
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map((product) => {
            const isOwner = currentUser?._id === product.author._id;
                        
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "https://via.placeholder.com/300")
                    }
                  />

                  {/* Badge statut produit */}
                  <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {PRODUCT_STATUS.APPROVED}
                  </span>

                  {/* Badge “Votre produit” si propriétaire */}
                  {isOwner && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      ✅ Votre produit
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-gray-500 text-sm mb-1">
                    Stock :{" "}
                    <span className="font-medium text-gray-700">
                      {product.stock || "Disponible"}
                    </span>
                  </p>

                  {!isOwner && (
                    <p className="text-gray-500 text-sm mb-2">
                      Auteur : {" "}
                      <span className="font-medium text-gray-700">
                        {product.author.name || "Utilisateur inconnu"}
                      </span>
                    </p>
                  )}

                  <p className="text-green-600 font-bold text-lg mb-3">
                    {product.price.toLocaleString()} FCFA
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap justify-between items-center gap-2">
                    {/* Likes */}
                    {currentUser && (
                      <button
                        onClick={() => handleLike(product._id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition font-medium ${
                          product.likes.includes(currentUser._id)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Heart
                          size={18}
                          className={
                            product.likes.includes(currentUser._id)
                              ? "fill-red-600"
                              : ""
                          }
                        />
                        <span>{product.likes.length}</span>
                      </button>
                    )}

                    {/* Vues */}
                    <div className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-2 rounded-xl">
                      <Eye size={18} />
                      <span>{product.views || 0} Vues</span>
                    </div>

                    {/* Commander uniquement si ce n’est pas son produit */}
                    {!isOwner && (
                      <a
                        href={`https://wa.me/${product.author.phone || "22953173035"}??text=Bonjour, je suis intéressé par *${product.name}* au prix de ${product.price} FCFA.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition font-medium"
                      >
                        <ShoppingCart size={18} />
                        Commander
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!currentUser && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/register")}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-purple-700 transition font-semibold"
          >
            Voulez-vous vendre aussi ? Inscrivez-vous !
          </button>
        </div>
      )}
    </div>
  );
}
