import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { LayoutDashboard, Info, Wallet, Phone } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";

interface UserSidebarProps {
  onLogout: () => void;
}

export default function UserSidebar({ onLogout }: UserSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const tabs = [
    { label: "Accueil", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "À propos", path: "/admin-dashboard/about", icon: Info },
    { label: "Mon Wallet", path: "/admin-dashboard/wallet", icon: Wallet },
    { label: "Contacter", path: "/admin-dashboard/contact", icon: Phone },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-gray-50 shadow-lg z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 bg-blue-400 text-white  rounded-br-3xl rounded-bl-3xl shadow-md">
        <img
          src={Logo}
          alt="Logo"
          className="h-12 w-12 object-contain rounded-full"
        />
        <h1 className="text-xl font-bold text-gray-800">Kipler</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((t) => {
          const isActive = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center
                ${isActive
                  ? "bg-green-100 text-green-700 shadow-inner"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"}
              `}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Logout en bas */}
      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
