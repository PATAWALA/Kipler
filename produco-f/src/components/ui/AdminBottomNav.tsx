
import { Wallet, Phone, Info, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminBottomNav() {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Accueil", path: "/admin-dashboard", icon: LayoutDashboard },
    { label: "À propos", path: "/admin-dashboard/about", icon: Info },
    { label: "Mon Wallet", path: "/admin-dashboard/wallet", icon: Wallet },
    { label: "Contacter", path: "/admin-dashboard/contact", icon: Phone },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around items-center py-2 md:hidden z-50">
      {menuItems.map(item => {
        const Icon = item.icon;
        return (
          <button key={item.path} onClick={() => navigate(item.path)} className="flex flex-col items-center text-gray-500 hover:text-blue-500 text-[10px]">
            <Icon size={20} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
