import axios from "axios";

export const API_URL = "http://localhost:5000/api/products";

// --- Types frontend --- //
export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image: string;

  // User (vendeur)
  user?: { _id: string; name: string; phone?: string } | string;

  status?: "approuvé" | "en_attente" | "rejeté" | "supprimé";
  createdAt?: string;
  views: number;

  // Auteur (simplifié pour l’affichage)
  author: {
    _id: string;
    name: string;
    phone?: string;
  };

  category?: string;
  stock?: string; // ✅ corrigé

  likes: (string | { _id: string; name?: string; phone?: string })[];
}

// --- Type brut renvoyé par le backend --- //
export interface ProductResponse {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
  user: { _id: string; name: string; phone?: string } ;
  status?: "approuvé" | "en_attente" | "rejeté" | "supprimé";
  createdAt?: string;

  author: {
    _id: string;
    name: string;
    phone?: string;
  };

  category?: string;
  stock?: string; // ✅ corrigé

  likes: (string | { _id: string; name?: string; phone?: string })[];
  views: number;
}


// Récupérer le token JWT depuis localStorage
export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔹 Mapping author pour compatibilité backend
function mapAuthor(p: ProductResponse) {
  return p.author ?? { _id: "", name: "Utilisateur inconnu", phone: "" };
}
// --- ⚡ Produits --- //

// --- ⚡ Produits ---
export async function getAllProducts(): Promise<ProductType[]> {
  const res = await axios.get<ProductResponse[]>(API_URL);
  console.log("📦 Produits bruts du backend :", res.data);

  return res.data.map((p) => {
    const product: ProductType = {
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image || "https://via.placeholder.com/150",
      status: p.status,
      createdAt: p.createdAt,
      author: mapAuthor(p),
      likes: p.likes || [],
      views: p.views ?? 0,
      category: p.category || "Autre",
      stock: p.stock ?? "Non spécifié",
    };

    console.log("🎨 Produit transformé :", product);
    console.log("🔍 BACK author:", p.author);
    return product;
  });
};

// ✅ Récupérer les produits par catégorie
export const getProductsByCategory = async (category: string): Promise<ProductType[]> => {
  const res = await axios.get(`${API_URL}/category/${encodeURIComponent(category)}`);
  return res.data;
};

export async function getProductsByUser(userId: string): Promise<ProductType[]> {
  const res = await axios.get<ProductResponse[]>(`${API_URL}/user/${userId}`, {
    headers: getAuthHeader(),
  });
  console.log("📦 Produits de l'utilisateur :", res.data);

  return res.data.map((p) => {
    const product: ProductType = {
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image || "https://via.placeholder.com/150",
      status: p.status,
      createdAt: p.createdAt,
      author: mapAuthor(p),
      likes: p.likes || [],
      views: p.views ?? 0,
      category: p.category || "Autre",
      stock: p.stock ?? "Non spécifié",
    };

    console.log("🎨 Produit transformé :", product);
    console.log("🔍 BACK author:", p.author);
    return product;
  });
}


export async function getProductById(productId: string): Promise<ProductType> {
  const res = await axios.get<ProductResponse>(`${API_URL}/${productId}`);
  const p = res.data;
  console.log("📦 Produit brut :", p);

  const product: ProductType = {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image || "https://via.placeholder.com/150",
    status: p.status,
    createdAt: p.createdAt,
    author: mapAuthor(p),
    likes: p.likes || [],
    views: p.views ?? 0,
    category: p.category || "Autre",
    stock: p.stock ?? "Non spécifié",
  };

  console.log("🎨 Produit transformé :", product);
  console.log("🔍 BACK author:", p.author);
  return product;
}

export async function addProduct(formData: FormData): Promise<ProductType> {
  const res = await axios.post<{ product: ProductResponse }>(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

  const p = res.data.product;
  console.log("📦 Produit ajouté (raw) :", p);

  const product: ProductType = {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image || "https://via.placeholder.com/150",
    status: p.status,
    createdAt: p.createdAt,
    author: mapAuthor(p),
    likes: p.likes || [],
    views: p.views ?? 0,
    category: p.category || "Autre",
    stock: p.stock ?? "Non spécifié",
  };

  console.log("🎨 Produit ajouté (mapped) :", product);
  console.log("🔍 BACK author:", p.author);

  return product;
}

export async function updateProduct(productId: string, formData: FormData): Promise<ProductType> {
  const res = await axios.put<{ product: ProductResponse }>(
    `${API_URL}/${productId}`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const p = res.data.product;
  console.log("📦 Produit mis à jour (raw) :", p);

  const product: ProductType = {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image || "https://via.placeholder.com/150",
    status: p.status,
    createdAt: p.createdAt,
    author: mapAuthor(p),
    likes: p.likes || [],
    views: p.views ?? 0,
    category: p.category || "Autre",
    stock: p.stock ?? "Non spécifié",
  };

  console.log("🎨 Produit transformé :", product);
  console.log("🔍 BACK author:", p.author);
  return product;
}


// ✅ Suppression d’un produit (user ou admin)
export async function deleteProduct(productId: string): Promise<void> {
  await axios.delete(`${API_URL}/${productId}`, { headers: getAuthHeader() });
}
// --- ⚡ Likes --- //

// Ajouter un like (cœur)
export async function likeProduct(productId: string, userId: string): Promise<ProductType> {
  const res = await axios.put<ProductResponse>(
    `${API_URL}/${productId}/like`,
    { userId }, // envoyer l'ID de l'utilisateur dans le body
    { headers: getAuthHeader() }
  );

  const p = res.data;

  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image,
    user: typeof p.user === "string" ? p.user : p.user?._id ?? "",
    status: p.status,
    createdAt: p.createdAt,
    author: p.author || { _id: "", name: "Utilisateur inconnu", phone: "" },
    likes: p.likes || [],
    views: p.views ?? 0,
  };
}

// Retirer un like
export async function unlikeProduct(productId: string, userId: string): Promise<ProductType> {
  const res = await axios.put<ProductResponse>(
    `${API_URL}/${productId}/unlike`,
    { userId }, // envoyer l'ID de l'utilisateur dans le body
    { headers: getAuthHeader() }
  );

  const p = res.data;

  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image,
    user: typeof p.user === "string" ? p.user : p.user?._id ?? "",
    status: p.status,
    createdAt: p.createdAt,
    author: p.author || { _id: "", name: "Utilisateur inconnu", phone: "" },
    likes: p.likes || [],
    views: p.views ?? 0,
  };
}

export async function viewProduct(productId: string): Promise<ProductType> {
  try {
    const res = await axios.post<ProductResponse>(
      `${API_URL}/${productId}/view`,
      {} // pas besoin de body
    );

    const p = res.data;

    // L'auteur pour affichage (pour le téléphone et le nom)
    const author = p.author
      ? { _id: p.author._id, name: p.author.name, phone: p.author.phone ?? "" }
      : { _id: "", name: "Utilisateur inconnu", phone: "" };

    return {
      _id: p._id,
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
      user: typeof p.user === "string" ? p.user : p.user._id,
      status: p.status,
      createdAt: p.createdAt,
      author,
      likes: p.likes || [],
      views: p.views ?? 0,
    };
  } catch (err) {
    console.error("Erreur viewProduct:", err);
    throw err;
  }
}
