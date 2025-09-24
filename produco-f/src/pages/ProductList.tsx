import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  userId: string;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Produits disponibles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-gray-600">{p.description}</p>
            <p className="text-blue-600 font-bold">{p.price.toLocaleString()} FCFA</p>
          </div>
        ))}
      </div>
    </div>
  );
}

