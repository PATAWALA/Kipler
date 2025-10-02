import { useState, useContext } from "react"; 
import { Bell, User, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, saveCurrentUser } from "../../utils/auth";
import { NotificationContext } from "../../context/notificationsContext";

interface AdminNavbarProps {
  onLogout: () => void;
}

export default function AdminNavbar({ onLogout }: AdminNavbarProps) {
  const currentUser = getCurrentUser();
  const [profileImage, setProfileImage] = useState<string>(
    currentUser?.photo || ""
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ⚡ Notifications context
  const notifContext = useContext(NotificationContext);
  if (!notifContext)
    throw new Error(
      "NotificationContext must be used within a NotificationsProvider"
    );
  const { notifications } = notifContext;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!currentUser) return null;

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage = reader.result as string;
      setProfileImage(newImage);
      saveCurrentUser({ ...currentUser, photo: newImage });
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="w-full h-[66px] flex items-center justify-between bg-white/90 backdrop-blur-md shadow-md px-6">
      {/* Nom de l'application */}
      <div className="text-xl font-bold text-green-600">
        Kipler
      </div>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-6 relative">
        {/* 🔔 Cloche notifications */}
        <button
          className="relative"
          onClick={() => navigate("/admin-dashboard/notifications")}
        >
          <Bell
            size={22}
            className="cursor-pointer text-gray-700 hover:text-green-600 transition"
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
            className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:ring-2 hover:ring-green-400 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-gray-600" />
            )}
          </div>

          {/* 📌 Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-xl border z-50 p-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-green-100 px-2 py-2 rounded-lg transition">
                <Camera size={18} />
                <span className="text-sm text-gray-700">Changer la photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>

              <button
                className="w-full text-left text-sm text-gray-700 hover:bg-green-100 px-2 py-2 rounded-lg transition"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/admin-dashboard/profile");
                }}
              >
                Modifier profil
              </button>

              <button
                className="w-full text-left text-sm text-white bg-green-600 hover:bg-green-700 px-2 py-2 rounded-lg mt-1 transition"
                onClick={onLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Mobile: nom à droite */}
        <div className="md:hidden text-lg font-bold text-green-600">
          Kipler
        </div>
      </div>
    </header>
  );
}

