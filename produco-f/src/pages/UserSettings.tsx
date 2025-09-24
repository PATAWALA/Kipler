import { useState, useEffect } from "react";
import { UserType } from "../utils/types";
import { saveCurrentUser } from "../utils/auth";
import axios from "axios";

interface UserSettingsProps {
  user: UserType;
}

export default function UserSettings({ user }: UserSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [darkMode, setDarkMode] = useState(user.darkMode || false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setDarkMode(user.darkMode || false);
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        name,
        email,
        darkMode,
        ...(password && password === confirmPassword ? { password } : {}),
      });
      saveCurrentUser(res.data);
      setMessage("Profil mis à jour avec succès ✅");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Erreur lors de la mise à jour ❌");
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Erreur inconnue ❌");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Paramètres du compte</h2>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Confirmer mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez le mot de passe"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold text-gray-700">Mode sombre</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
