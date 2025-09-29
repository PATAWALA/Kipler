import { useState, useContext } from "react";
import { User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { AuthUser } from "../../services/authServices";
import { NotificationContext } from "../../context/notificationsContext";

interface UserNavbarProps {
  onLogout: () => void;
}

export default function UserNavbar({ onLogout }: UserNavbarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentUser = getCurrentUser() as AuthUser | null;

  const notifContext = useContext(NotificationContext);
  if (!notifContext)
    throw new Error(
      "NotificationContext must be used within a NotificationsProvider"
    );

  const { notifications } = notifContext;
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!currentUser) return null;

  return (
    <header className="w-full h-[66px] flex items-center justify-between bg-white/90 backdrop-blur-md shadow-md px-4 md:px-6 z-50">
      {/* Nom de l'application à gauche */}
      <div className="text-xl font-bold text-blue-600">
        Kipler
      </div>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-4 md:space-x-6 relative">
        {/* 🔔 Cloche Notifications */}
        <button
          onClick={() => navigate("/user-dashboard/notifications")}
          className="relative"
        >
          <Bell
            size={22}
            className="text-gray-700 hover:text-blue-600 transition"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* 👤 Avatar */}
        <div className="relative">
          <div
            className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {currentUser.photo ? (
              <img
                src={currentUser.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-gray-600" />
            )}
          </div>

          {/* 📌 Dropdown: Modifier profil + Déconnexion */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border z-50 p-2 flex flex-col gap-1">
              <button
                className="w-full text-left text-sm text-gray-700 hover:bg-blue-50 px-2 py-2 rounded-lg transition"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/user-dashboard/profile");
                }}
              >
                Modifier profil
              </button>
              <button
                className="w-full text-left text-sm text-gray-700 hover:bg-red-100 px-2 py-2 rounded-lg transition"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
