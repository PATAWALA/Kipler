import { useState } from "react";
import { UserType } from "../utils/types";
import { getCurrentUser } from "../utils/auth";

export default function AdminSettings() {
  const currentUser = getCurrentUser() as UserType | null;
  const [darkMode, setDarkMode] = useState(currentUser?.darkMode || false);

  if (!currentUser) return <p>Utilisateur non trouvé</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">⚙️ Paramètres</h2>
      
      <div className="space-y-4">
        <p><b>Nom:</b> {currentUser.name}</p>
        <p><b>Email:</b> {currentUser.email}</p>
        <p><b>Rôle:</b> {currentUser.role}</p>

        {/* Toggle Dark Mode */}
        <div className="flex items-center gap-2">
          <label htmlFor="darkMode">🌙 Mode sombre</label>
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
    </div>
  );
}
