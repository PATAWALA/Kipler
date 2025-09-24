import { useState, useContext } from "react";
import { User, Camera, LogOut, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { getCurrentUser, saveCurrentUser } from "../../utils/auth";
import { AuthUser } from "../../services/authServices";
import { NotificationContext } from "../../context/notificationsContext";

interface UserNavbarProps {
  onLogout: () => void;
}

export default function UserNavbar({ onLogout }: UserNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentUser = getCurrentUser() as AuthUser | null;
  const [profileImage, setProfileImage] = useState<string>(currentUser?.photo || "");
  const navigate = useNavigate();
  const location = useLocation();

  const notifContext = useContext(NotificationContext);
  if (!notifContext) throw new Error("NotificationContext must be used within a NotificationsProvider");
  const { notifications } = notifContext;
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) return null;

  const tabs = [
    { label: "Tableau de bord", path: "/user-dashboard" },
    { label: "Mes Produits", path: "/user-dashboard/products" },
    { label: "Marché", path: "/user-dashboard/market" },
    { label: "Mes Gains", path: "/user-dashboard/gains" },
    { label: "Nous Contacter", path: "/user-dashboard/contact" },
    { label: "Paramètres", path: "/user-dashboard/settings" },
  ];

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
    <header className="fixed top-0 z-30 w-full h-[66px] flex items-center justify-between bg-white/80 backdrop-blur-md shadow-md px-6">
      <div className="flex items-center h-16 md:h-14">
        <img src={Logo} alt="Logo" className="h-12 md:h-10 w-auto object-cover rounded-lg transition-all" />
      </div>

      {/* Desktop Tabs */}
      <nav className="hidden md:flex space-x-6">
        {tabs.map(t => {
          const isActive = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`relative pb-1 text-sm font-medium transition-all 
                ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"}`}
            >
              {t.label}
              {/* Barre animée en bas */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full bg-blue-600 transition-all duration-300 
                  ${isActive ? "scale-x-100" : "scale-x-0"}`}
              ></span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center space-x-4 relative">
        <button onClick={onLogout} className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm shadow hover:bg-red-600 transition">
          <LogOut size={16} />
          Déconnexion
        </button>

        <button onClick={() => navigate("/user-dashboard/notifications")} className="relative">
          <Bell size={22} className="text-gray-700 hover:text-blue-600 transition" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative md:block" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-gray-600" />
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border z-50 p-3">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-200 px-2 py-2 rounded-lg transition">
                <Camera size={18} />
                <span className="text-sm text-gray-700">Changer la photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>
              <button className="text-left text-sm hover:bg-blue-200 px-2 py-2 rounded-lg transition text-gray-700">
                Modifier profil
              </button>
              <button className="md:hidden flex items-center gap-2 text-left text-sm hover:bg-red-50 px-2 py-2 rounded-lg transition text-red-600" onClick={onLogout}>
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
