import { useState } from "react";
import axios from "axios";

export default function PublishProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("⚠️ Merci de choisir une image !");
      return;
    } 

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("image", image);

      // si tu utilises un token JWT pour l’admin :
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      alert("✅ Produit publié avec succès !");
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la publication");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Publier un produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Publier
        </button>
      </form>
    </div>
  );
}
