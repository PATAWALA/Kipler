import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  userId: string;
  type: "payment" | "sale"; 
  amount: number;
  date: string;
}

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalGains, setTotalGains] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transactions"); // ⚠️ Backend : créer cette route
        const data: Transaction[] = res.data || [];
        setTransactions(data);
        console.log("📦 Transactions reçues :", res.data)

        // Calculer les gains
        const adminGains = data
          .filter(t => t.type === "payment")
          .reduce((acc, t) => acc + t.amount, 0);

        const usersGains = data
          .filter(t => t.type === "sale")
          .reduce((acc, t) => acc + t.amount, 0);

        setTotalGains(adminGains);
        setUsersTotal(usersGains);
      } catch (err) {
        console.error("Erreur lors de la récupération des transactions :", err);
        setError("Impossible de récupérer les transactions pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Chargement des transactions...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">💰 Mon Wallet</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600 text-lg">Argent total gagné grâce à mes utilisateurs</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalGains.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600 text-lg">Argent total gagné par les utilisateurs</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{usersTotal.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Historique des transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-600 text-center">Aucune transaction pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((t, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span className="text-gray-600">
                  {t.type === "payment" ? `Paiement user ${t.userId}` : `Vente user ${t.userId}`}
                </span>
                <span className={`font-semibold ${t.type === "payment" ? "text-green-600" : "text-blue-600"}`}>
                  {t.amount.toLocaleString()} FCFA
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

