import { useState } from "react";
import { Bell, User, Camera, LayoutDashboard, Info, Wallet, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 import
import { getCurrentUser, saveCurrentUser } from "../../utils/auth";
import Logo from "../../assets/logo.png";

interface AdminNavbarProps {
  onLogout: () => void;
}

export default function AdminNavbar({ onLogout }: AdminNavbarProps) {
  const currentUser = getCurrentUser();
  const [profileImage, setProfileImage] = useState<string>(currentUser?.photo || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 pour détecter la route active

  if (!currentUser) return null;

  const tabs = [
    { label: "Accueil", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "À propos", path: "/admin-dashboard/about", icon: Info },
    { label: "Mon Wallet", path: "/admin-dashboard/wallet", icon: Wallet },
    { label: "Contacter", path: "/admin-dashboard/contact", icon: Phone },
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
    <header className="fixed top-0 z-30 w-full h-[66px] flex items-center justify-between bg-white/90 backdrop-blur-md shadow-md px-6">
      <div className="flex items-center h-16 md:h-14">
        <img src={Logo} alt="Logo" className="h-12 md:h-10 w-auto object-cover rounded-lg transition-all" />
      </div>

      {/* Desktop Tabs */}
      <nav className="hidden md:flex space-x-6">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`relative pb-1 flex items-center gap-1 text-sm font-medium transition-all 
                ${isActive ? "text-green-600" : "text-gray-600 hover:text-green-500"}`}
            >
              <Icon size={18} />
              {t.label}
              {/* Barre animée en bas */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full bg-green-600 transition-all duration-300 
                  ${isActive ? "scale-x-100" : "scale-x-0"}`}
              ></span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center space-x-5 relative">
        <button
          onClick={onLogout}
          className="hidden md:inline-flex text-sm text-white font-medium bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition"
        >
          Déconnexion
        </button>

        <Bell size={22} className="cursor-pointer text-gray-700 hover:text-green-600 transition" />

        <div className="relative" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-300 hover:ring-2 hover:ring-green-400 transition">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-gray-600" />
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border z-50 p-3">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-green-100 px-2 py-2 rounded-lg transition">
                <Camera size={18} />
                <span className="text-sm text-gray-700">Changer la photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              </label>
              <button className="text-left text-sm hover:bg-green-100 px-2 py-2 rounded-lg transition text-gray-700">
                Modifier profil
              </button>
              <button
                className="md:hidden mt-1 text-left text-sm text-white bg-green-600 hover:bg-green-700 px-2 py-2 rounded-lg transition"
                onClick={onLogout}
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
