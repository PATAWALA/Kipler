// utils/productFormatter.ts
export const formatProduct = (p: any) => {
  const author = p.user || null;
  const likes = p.likes || [];

  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image || "https://via.placeholder.com/150",
    status: p.status,
    createdAt: p.createdAt,
    category: p.category || "Autre",
    stock: p.stock ?? "Disponible",
    views: p.views ?? 0,

    // ✅ likes toujours normalisés
    likes: likes.map((u: any) => ({
      _id: u._id,
      name: u.name,
      phone: u.phone || "",
    })),

    // ✅ auteur toujours présent
    author: author
      ? { _id: author._id, name: author.name, phone: author.phone || "" }
      : { _id: "", name: "Utilisateur inconnu", phone: "" },
  };
};
