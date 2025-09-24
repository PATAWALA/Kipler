import { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/authServices";
import { motion, AnimatePresence } from "framer-motion";
import { UserType } from "../utils/types";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data: UserType[] = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des utilisateurs :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleBlock = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment bloquer ce compte utilisateur ?")) {
      try {
        await blockUser(id);
        setUsers(prev =>
          prev.map(u => (u._id === id ? { ...u, status: "blocked" } : u))
        );
        alert("✅ Utilisateur bloqué !");
      } catch (err) {
        console.error(err);
        alert("❌ Impossible de bloquer cet utilisateur.");
      }
    }
  };

  const handleUnblock = async (id: string) => {
    if (window.confirm("Voulez-vous réactiver ce compte ?")) {
      try {
        await unblockUser(id);
        setUsers(prev =>
          prev.map(u => (u._id === id ? { ...u, status: "active" } : u))
        );
        alert("✅ Utilisateur réactivé !");
      } catch (err) {
        console.error(err);
        alert("❌ Impossible de réactiver cet utilisateur.");
      }
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📋 Liste des utilisateurs</h2>

      {/* ✅ Tableau desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rôle</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map(user => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-blue-50"
                >
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 break-all">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">{user.phone || "N/A"}</td>
                  <td className="p-2 font-semibold text-sm">
                    {user.status === "blocked" ? (
                      <span className="text-red-600">Bloqué</span>
                    ) : (
                      <span className="text-green-600">Actif</span>
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    {user.status === "blocked" ? (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Débloquer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Bloquer
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ✅ Cartes mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        <AnimatePresence>
          {users.map(user => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-xl shadow p-4 border"
            >
              <p className="font-bold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600 break-all">{user.email}</p>
              <p className="capitalize text-gray-500">Rôle : {user.role}</p>
              <p className="text-gray-500">📞 {user.phone || "N/A"}</p>
              <p className="mt-1 font-semibold">
                {user.status === "blocked" ? (
                  <span className="text-red-600">Bloqué</span>
                ) : (
                  <span className="text-green-600">Actif</span>
                )}
              </p>

              <div className="mt-3 flex gap-2">
                {user.status === "blocked" ? (
                  <button
                    onClick={() => handleUnblock(user._id)}
                    className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Débloquer
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(user._id)}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Bloquer
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
